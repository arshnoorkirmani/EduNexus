import { forwardRef, useEffect, useState } from "react";
import {
  DEMO_STUDENT,
  StudentIdClassic,
  StudentIdData,
  StudentIdMinimal,
  StudentIdModern,
} from "./StudentIdCard";
import { Button } from "@/components/ui/button";
import { EditIcon, Minimize2Icon, X, ZoomIn, ZoomOutIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PrintButton from "../form/action/printButton";
import { HtmlToImageDownloader } from "../form/action/HtmlToImageDownlodeButton";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LayoutTemplate, Settings2 } from "lucide-react";

type StudentIdDesign = "classic" | "modern" | "minimal";

interface StudentIdDialogProps {
  student?: StudentIdData;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  defaultDesign?: StudentIdDesign;
  onEdit?: () => void;
  preventOutsideClick?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                                 Helpers                                    */
/* -------------------------------------------------------------------------- */

function useMediaQuery(query: string) {
  const [value, setValue] = useState(false);

  useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches);
    }

    const result = matchMedia(query);
    result.addEventListener("change", onChange);
    setValue(result.matches);

    return () => result.removeEventListener("change", onChange);
  }, [query]);

  return value;
}

/* -------------------------------------------------------------------------- */
/*                              Helper Component                               */
/* -------------------------------------------------------------------------- */

const RenderCard = forwardRef<
  HTMLDivElement,
  { layout: StudentIdDesign; data: StudentIdData; uniqueId?: string }
>(({ layout, data, uniqueId }, ref) => {
  switch (layout) {
    case "modern":
      return <StudentIdModern ref={ref} data={data} uniqueId={uniqueId} />;
    case "minimal":
      return <StudentIdMinimal ref={ref} data={data} uniqueId={uniqueId} />;
    default:
      return <StudentIdClassic ref={ref} data={data} uniqueId={uniqueId} />;
  }
});

RenderCard.displayName = "RenderCard";

/* -------------------------------------------------------------------------- */
/*                            Content Component                               */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/*                            Content Component                               */
/* -------------------------------------------------------------------------- */
interface StudentIdContentProps {
  student: StudentIdData;
  design: StudentIdDesign;
  setDesign: (design: StudentIdDesign) => void;
  onClose?: () => void;
}

function StudentIdContent({
  student,
  design,
  setDesign,
  onClose,
  onEdit,
}: StudentIdContentProps & { onEdit?: () => void }) {
  return (
    <div className="flex flex-col w-full bg-muted/30 overflow-hidden sm:rounded-2xl">
      {/* 1. Sticky Top Action Bar */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border px-4 sm:px-6 py-3 flex items-center justify-between shrink-0 h-[68px]">
        {/* Left: Identity */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-primary rounded-lg flex items-center justify-center shadow-sm text-primary-foreground font-bold tracking-tighter text-base">
            ID
          </div>
          <div className="hidden sm:block">
            <h2 className="text-sm font-bold tracking-tight text-foreground leading-none">
              Identifier
            </h2>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-0.5">
              ID Card Designer
            </p>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Layout Selector */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="cursor-pointer h-9 w-9 sm:w-auto sm:px-3 sm:border sm:border-border text-muted-foreground hover:text-foreground hover:bg-accent gap-2 p-0 justify-center sm:justify-start"
              >
                <LayoutTemplate className="w-4 h-4" />
                <span className="text-xs font-semibold tracking-wide hidden sm:inline-block">
                  LAYOUT
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side="bottom"
              align="end"
              sideOffset={8}
              collisionPadding={12}
              className="w-48 p-2 z-[100]"
            >
              <div className="grid gap-1">
                <h4 className="px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Select Design
                </h4>
                {(["classic", "modern", "minimal"] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDesign(d)}
                    className={cn(
                      "cursor-pointer w-full px-3 py-2 text-xs font-medium rounded-md text-left transition-colors",
                      design === d
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <div className="hidden sm:block h-4 w-px bg-border sm:mx-1" />

          {/* Actions */}
          {onEdit && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="h-9 px-3 rounded-lg font-medium text-xs hidden sm:inline-flex shadow-sm bg-background/50 hover:bg-background"
              >
                <EditIcon className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={onEdit}
                className="h-9 w-9 rounded-lg sm:hidden shadow-sm bg-background/50"
              >
                <EditIcon className="w-4 h-4" />
              </Button>
            </>
          )}

          <PrintButton
            id={`${design}-student-id-card`}
            label="Print"
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground h-9 px-3 rounded-lg font-medium text-xs hidden sm:inline-flex"
            documentTitle={`${student.name.replace(/\s+/g, "_")}_ID_Card`}
          />
          <PrintButton
            id={`${design}-student-id-card`}
            label="Print"
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground h-9 w-9 rounded-lg sm:hidden"
            isIconOnly={true}
            documentTitle={`${student.name.replace(/\s+/g, "_")}_ID_Card`}
          />

          <HtmlToImageDownloader
            id={`${design}-student-id-card`}
            fileName={`${student.name.replace(/\s+/g, "_")}_ID_Card`}
            label="Export"
            buttonClassName="bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 rounded-lg text-xs font-bold uppercase tracking-wide shadow-sm hover:shadow-md transition-all"
          />

          <div className="hidden sm:block h-4 w-px bg-border mx-1 sm:mx-2" />

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 2. Main Stage: Responsive Preview */}
      <div className="flex items-center justify-center relative bg-muted/20 overflow-hidden p-6 sm:p-12 lg:p-16 text-muted-foreground/20 min-h-[400px] sm:min-h-[500px]">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(currentColor_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />

        {/* Responsive Scale Wrapper */}
        <div className="w-full h-full flex items-center justify-center">
          <div className="transform scale-[0.85] xs:scale-[0.9] sm:scale-100 lg:scale-110 transition-transform duration-500 ease-out-back origin-center">
            <div className="relative shadow-md rounded-2xl bg-card ring-1 ring-border">
              <div className="print-area">
                <RenderCard key={design} layout={design} data={student} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StudentIdDialog({
  student,
  open,
  onOpenChange,
  trigger,
  defaultDesign = "classic",
  onEdit,
  preventOutsideClick = false,
}: StudentIdDialogProps) {
  const [design, setDesign] = useState<StudentIdDesign>(defaultDesign);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        onInteractOutside={(e) => {
          if (preventOutsideClick) {
            e.preventDefault();
          }
        }}
        className="p-0 gap-0 overflow-hidden flex flex-col outline-none bg-background max-h-[100dvh] w-full sm:w-[90vw] sm:max-w-3xl lg:max-w-4xl sm:h-auto sm:rounded-2xl sm:border sm:border-border sm:shadow-2xl md:left-[calc(50%+130px)] lg:left-[calc(50%+140px)]"
      >
        {/* We moved header logic inside Content for sticky behavior, so standard DialogHeader is removed or empty if needed for accessibility, but we have a visible header in content. */}
        <DialogTitle className="sr-only">Student ID Card Designer</DialogTitle>
        <DialogDescription className="sr-only">
          Customize and export student ID cards
        </DialogDescription>

        {student ? (
          <StudentIdContent
            student={student}
            design={design}
            setDesign={setDesign}
            onClose={() => onOpenChange?.(false)}
            onEdit={onEdit}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full w-full bg-muted/30 p-8 text-center">
            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4 ring-1 ring-border">
              <LayoutTemplate className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              No Student Data
            </h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-[280px]">
              Student data is missing or incomplete. Please close this dialog
              and select a valid student.
            </p>
            <Button
              variant="outline"
              className="mt-6 gap-2"
              onClick={() => onOpenChange?.(false)}
            >
              <X className="w-4 h-4" />
              Close Preview
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
