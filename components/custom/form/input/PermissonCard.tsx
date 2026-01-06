import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

type PermissionCardProps = {
  form: any;
};

export function PermissionCard({ form }: PermissionCardProps) {
  return (
    <Card className="rounded-2xl border border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold tracking-tight">
          Permissions & Access Control
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Control what the student can view and manage inside the system
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* ================= SUPER ADMIN ================= */}
        <FormField
          control={form.control}
          name="permissions.super"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-xl border p-4">
              <div>
                <FormLabel className="text-sm font-medium">
                  Super Access
                </FormLabel>
                <p className="text-xs text-muted-foreground">
                  Grants full access to all modules
                </p>
              </div>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Separator />

        {/* ================= PROFILE ================= */}
        <PermissionGroup title="Profile">
          <PermissionItem
            form={form}
            name="permissions.profile.show"
            label="View Profile"
          />
          <PermissionItem
            form={form}
            name="permissions.profile.edit"
            label="Edit Profile"
          />
        </PermissionGroup>

        {/* ================= COMMUNICATION ================= */}
        <PermissionGroup title="Communication">
          <PermissionItem
            form={form}
            name="permissions.communication.sendMessage"
            label="Send Messages"
          />
          <PermissionItem
            form={form}
            name="permissions.communication.inboxMessage"
            label="Inbox Messages"
          />
        </PermissionGroup>

        {/* ================= FEES ================= */}
        <PermissionGroup title="Fees">
          <PermissionItem
            form={form}
            name="permissions.fees.view"
            label="View Fees"
          />
          <PermissionItem
            form={form}
            name="permissions.fees.pay"
            label="Pay Fees"
          />
        </PermissionGroup>

        {/* ================= DOCUMENT ================= */}
        <PermissionGroup title="Documents">
          <PermissionItem
            form={form}
            name="permissions.document.upload"
            label="Upload Documents"
          />
          <PermissionItem
            form={form}
            name="permissions.document.download"
            label="Download Documents"
          />
        </PermissionGroup>

        {/* ================= ACADEMIC ================= */}
        <PermissionGroup title="Academic">
          <PermissionItem
            form={form}
            name="permissions.result.view"
            label="View Results"
          />
          <PermissionItem
            form={form}
            name="permissions.attendance.view"
            label="View Attendance"
          />
          <PermissionItem
            form={form}
            name="permissions.assignments.view"
            label="View Assignments"
          />
          <PermissionItem
            form={form}
            name="permissions.timetable.view"
            label="View Timetable"
          />
        </PermissionGroup>
      </CardContent>
    </Card>
  );
}
function PermissionGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold">{title}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{children}</div>
    </div>
  );
}

function PermissionItem({
  form,
  name,
  label,
}: {
  form: any;
  name: string;
  label: string;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex items-center justify-between rounded-lg border p-3">
          <FormLabel className="text-sm">{label}</FormLabel>
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
