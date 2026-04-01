"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MessageSquareMore, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { recordWorkflowDecision } from "@/actions/workflows";
import { toast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Textarea } from "../ui/textarea";

const workflowDecisionSchema = z.object({
  decision: z.enum(["approve", "reject", "comment"]),
  comments: z.string().trim(),
});

type WorkflowDecisionValues = z.infer<typeof workflowDecisionSchema>;

const defaultValues: WorkflowDecisionValues = {
  decision: "approve",
  comments: "",
};

interface WorkflowActionSheetProps {
  stepId: string;
  title: string;
  isActionable: boolean;
}

export function WorkflowActionSheet({ stepId, title, isActionable }: WorkflowActionSheetProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<WorkflowDecisionValues>({
    resolver: zodResolver(workflowDecisionSchema),
    defaultValues,
  });

  useEffect(() => {
    if (isOpen) {
      form.reset(defaultValues);
    }
  }, [form, isOpen]);

  const onSubmit = (values: WorkflowDecisionValues) => {
    startTransition(async () => {
      const result = await recordWorkflowDecision({
        stepId,
        decision: values.decision,
        comments: values.comments,
      });

      if (!result.success) {
        toast({
          title: "Workflow update failed",
          description: result.error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Workflow updated",
        description: "The latest review decision has been recorded.",
      });

      setIsOpen(false);
      router.refresh();
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button size="sm" disabled={!isActionable}>
          <ShieldCheck className="size-4" />
          Act on step
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader className="space-y-1">
          <SheetTitle>Record decision</SheetTitle>
          <SheetDescription>{title}</SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <FormField
              control={form.control}
              name="decision"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Decision</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select decision" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="approve">Approve</SelectItem>
                      <SelectItem value="reject">Reject</SelectItem>
                      <SelectItem value="comment">Comment only</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comments</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-32 resize-none"
                      placeholder="Add review notes, approval remarks, or rejection comments."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end gap-3 border-t pt-6">
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Saving
                  </>
                ) : (
                  <>
                    <MessageSquareMore className="size-4" />
                    Save decision
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
