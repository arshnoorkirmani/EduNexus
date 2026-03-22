import { ICounter } from "@/models/CounterSchema";
import dbConnect from "@/lib/DatabaseConnection";
import { apiClient } from "@/helper/ApiClient";
import { AppData } from "./appConfig";
import { Student } from "@/types/models/student.model";
import { StudentFormData } from "@/lib/validators/institute/add-student.validator";
import { errorToast, promiseToast } from "@/components/custom/utils/Toast";
import mediaService from "@/config/MediaConfig";
import { MediaStatus } from "@/types/media";

type GenerateResult<T extends string> = {
  success: boolean;
  error?: string;
} & Record<T, string | undefined>;

export class StudentService {
  /* --------------------------------------------
   * Atomic Counter Helper
   * ------------------------------------------ */
  private async getNextSequence(
    key: string,
    institute_code: string
  ): Promise<number> {
    console.log("key", key);
    const parts = key.split(":");
    const response = await apiClient.get<{
      success: boolean;
      data: ICounter;
    }>(
      `${AppData.routes.backend.api.institute.getSequence}?institute_code=${institute_code}&key=${key}`
    );
    console.log("Response", response);
    if (!response.success || !response.data) {
      throw new Error("Failed to get sequence");
    }
    const { seq } = response.data;
    return seq + 1;
  }
  /* --------------------------------------------
   * Student ID → INST-0001
   * ------------------------------------------ */
  public async generateStudentId(
    institute_code: string
  ): Promise<string | null> {
    try {
      const seq = await this.getNextSequence(
        `STUDENT:${institute_code}`,
        institute_code
      );

      return `${institute_code}-${String(seq).padStart(4, "0")}`;
    } catch {
      return null;
    }
  }

  /* --------------------------------------------
   * Roll No → 2025ABC0001
   * ------------------------------------------ */
  public async generateRollNo(
    institute_code: string,
    course_code: string
  ): Promise<string | null> {
    try {
      const year = new Date().getFullYear();

      const seq = await this.getNextSequence(
        `ROLL:${year}:${course_code}:${institute_code}`,
        institute_code
      );
      console.log("Sequence", seq, institute_code, course_code);
      return `${year}${course_code}${String(seq).padStart(4, "0")}`;
    } catch {
      console.log("Failed to get sequence");
      return null;
    }
  }

  /* --------------------------------------------
   * Registration No → 2025ABCREG0001
   * ------------------------------------------ */
  public async generateRegistrationNo(
    institute_code: string
  ): Promise<string | null> {
    try {
      const year = new Date().getFullYear();

      const seq = await this.getNextSequence(
        `REG:${year}:${institute_code}`,
        institute_code
      );

      return `${institute_code}/${year}/${String(seq).padStart(4, "0")}`;
    } catch {
      return null;
    }
  }
  public async createStudent(
    institute_code: string,
    incomingPayload: StudentFormData
  ) {
    try {
      const payload = {
        ...incomingPayload,
        fees: {
          ...incomingPayload.fees,
          detail:
            incomingPayload.fees?.paidFees > 0
              ? [
                  {
                    date: new Date(),
                    amount: incomingPayload.fees.paidFees,
                    method: "cash",
                  },
                ]
              : [],
        },
      };

      const request = apiClient.post<{
        success: boolean;
        data: Student;
      }>(AppData.routes.backend.api.institute.createStudent, {
        institute_code,
        payload,
      });

      promiseToast(request, {
        loading: "Creating student...",
        success: "Student created successfully",
        error: (err) => err?.message || "Error creating student",
      });

      const response = await request;

      console.log("Student ServiceResponse", response);

      // --- Sync Media Status to "UPLOADED" ---
      if (response && response.data && incomingPayload.auth?.studentId && incomingPayload.documents?.length) {
        try {
          const submittedUrls = incomingPayload.documents.map((d: any) => d.file.url);
          
          await mediaService.syncMediaStatusByUrls(
            { 
              entity: "student", 
              entityId: incomingPayload.auth.studentId, 
              field: "documents" 
            },
            submittedUrls,
            MediaStatus.UPLOADED
          );
        } catch (mediaError) {
          console.error("Failed to update student document media statuses:", mediaError);
          // 🔴 Crucial: We don't throw here to avoid failing the already-successful student creation response
        }
      }
      // ---------------------------------------

      return response.data;
    } catch (error: any) {
      console.log("Error creating student", error);
      return null;
    }
  }
}

export const studentService = new StudentService();
