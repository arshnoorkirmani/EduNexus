import { ICounter } from "@/models/CounterSchema";
import dbConnect from "@/lib/DatabaseConnection";
import { apiClient } from "@/helper/ApiClient";

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
    }>(`/api/institute/get-seq?institute_code=${institute_code}&key=${key}`);
    if (!response.success || !response.data) {
      throw new Error("Failed to get sequence");
    }
    const { seq } = response.data;
    return seq;
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

      return `${year}${course_code}${String(seq).padStart(4, "0")}`;
    } catch {
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
}

export const studentService = new StudentService();
