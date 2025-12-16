export function AppFooter() {
  return (
    <footer className="border-t bg-background px-6 py-3 text-sm text-muted-foreground">
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <span>© {new Date().getFullYear()} Institute Management System</span>

        <span className="text-xs">Powered by EduNexus • Secure • Scalable</span>
      </div>
    </footer>
  );
}
