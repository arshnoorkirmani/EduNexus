// app/api/courses/route.ts
import { NextRequest, NextResponse } from "next/server";
import { CourseModel } from "@/models/CoursesSchema";
import dbConnect from "@/lib/DatabaseConnection";
//=======================================================================//
//                  POST method
//======================================================================//
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      institute_code,
      course_code,
      course_name,
      category,
      type,
      duration,
      eligibility,
      fees,
      status,
      description,
    } = body;
    console.log(body);
    /* ------------------------------------------------------------- */
    /* BASIC VALIDATION                                              */
    /* ------------------------------------------------------------- */
    if (
      !institute_code ||
      !course_code ||
      !course_name ||
      !category ||
      !type ||
      !duration?.value ||
      !duration?.unit ||
      !fees?.total
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }

    /* ------------------------------------------------------------- */
    /* DB CONNECTION (Institute Scoped)                               */
    /* ------------------------------------------------------------- */
    await dbConnect(institute_code);

    /* ------------------------------------------------------------- */
    /* CREATE COURSE                                                 */
    /* ------------------------------------------------------------- */
    const course = await CourseModel.create({
      course_code: course_code.toUpperCase(),
      course_name: course_name.trim(),
      category,
      type,
      duration: {
        value: Number(duration.value),
        unit: duration.unit,
      },
      eligibility: eligibility?.trim(),
      fees: {
        total: Number(fees.total),
        currency: fees.currency || "INR",
      },
      status: status || "active",
      description: description?.trim(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Course created successfully",
        data: course,
      },
      { status: 201 }
    );
  } catch (error: any) {
    /* ------------------------------------------------------------- */
    /* DUPLICATE COURSE HANDLING                                     */
    /* ------------------------------------------------------------- */
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "Course with this course_code already exists",
        },
        { status: 409 }
      );
    }

    console.error("COURSE_CREATE_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create course",
      },
      { status: 500 }
    );
  }
}
// =======================================================================//
//                      GET method
// =======================================================================//
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const institute_code = searchParams.get("institute_code");
    if (!institute_code) {
      return NextResponse.json(
        { success: false, message: "institute_code is required" },
        { status: 400 }
      );
    }

    await dbConnect(institute_code);

    /* ------------------------------------------------------------- */
    /* PAGINATION                                                     */
    /* ------------------------------------------------------------- */
    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const limit = Math.min(Number(searchParams.get("limit")) || 0, 50);
    const skip = (page - 1) * limit;

    /* ------------------------------------------------------------- */
    /* FILTERS                                                        */
    /* ------------------------------------------------------------- */
    const filter: Record<string, any> = {};

    const course_code = searchParams.get("course_code");
    if (course_code) filter.course_code = course_code.toUpperCase();

    const course_name = searchParams.get("course_name");
    if (course_name)
      filter.course_name = { $regex: course_name, $options: "i" };

    const category = searchParams.get("category");
    if (category) filter.category = category;

    const type = searchParams.get("type");
    if (type) filter.type = type;

    const status = searchParams.get("status");
    if (status) filter.status = status;

    /* ------------------------------------------------------------- */
    /* QUERY                                                          */
    /* ------------------------------------------------------------- */
    const [courses, totalCourses] = await Promise.all([
      CourseModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      CourseModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCourses / limit);

    return NextResponse.json(
      {
        success: true,
        data: courses,
        pagination: {
          page,
          limit,
          totalPages,
          totalCourses,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("COURSE_GET_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch courses",
      },
      { status: 500 }
    );
  }
}
// =======================================================================//
//                      PUT method (Update Course)
// =======================================================================//
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      institute_code,
      course_code,
      course_name,
      category,
      type,
      duration,
      eligibility,
      fees,
      status,
      description,
    } = body;

    if (!institute_code || !course_code) {
      return NextResponse.json(
        {
          success: false,
          message: "institute_code and course_code are required",
        },
        { status: 400 }
      );
    }

    await dbConnect(institute_code);

    const updateData: Record<string, any> = {};

    if (course_name) updateData.course_name = course_name.trim();
    if (category) updateData.category = category;
    if (type) updateData.type = type;
    if (status) updateData.status = status;
    if (eligibility) updateData.eligibility = eligibility.trim();
    if (description) updateData.description = description.trim();

    if (duration?.value && duration?.unit) {
      updateData.duration = {
        value: Number(duration.value),
        unit: duration.unit,
      };
    }

    if (fees?.total) {
      updateData.fees = {
        total: Number(fees.total),
        currency: fees.currency || "INR",
      };
    }

    const updatedCourse = await CourseModel.findOneAndUpdate(
      { course_code },
      { $set: updateData },
      { new: true }
    );

    if (!updatedCourse) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Course updated successfully",
        data: updatedCourse,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("COURSE_UPDATE_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update course",
      },
      { status: 500 }
    );
  }
}
// =======================================================================//
//                      DELETE method (Archive Course)
// =======================================================================//
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const institute_code = searchParams.get("institute_code");
    const course_code = searchParams.get("course_code");

    if (!institute_code || !course_code) {
      return NextResponse.json(
        {
          success: false,
          message: "institute_code and course_id are required",
        },
        { status: 400 }
      );
    }

    await dbConnect(institute_code);

    const deletedCourse = await CourseModel.findOneAndUpdate(
      { course_code },
      { $set: { status: "archived" } },
      { new: true }
    );

    if (!deletedCourse) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Course archived successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("COURSE_DELETE_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to delete course",
      },
      { status: 500 }
    );
  }
}
