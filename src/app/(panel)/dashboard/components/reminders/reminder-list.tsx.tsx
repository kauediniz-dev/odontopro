"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Reminder } from "@prisma/client";
import { Plus, Trash } from "lucide-react";
import { deleteReminder } from "../../_actions/delete-reminder";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ReminderListProps {
  reminder: Reminder[];
}
export function ReminderList({ reminder }: ReminderListProps) {
  const router = useRouter();
  async function handleDeleteReminder(Id: string) {
    const response = await deleteReminder({ reminderId: Id });

    if (response.error) {
      toast.error(response.error);
      return;
    }
    toast.success(response.data);
    router.refresh();
  }
  return (
    <div className="flex flex-col gap-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl md:text-2xl font-bold">
            Lembretes
          </CardTitle>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <Plus className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent>
          {reminder.length === 0 && (
            <p className="text-sm text-gray-500">
              Nenhum lembrete encontrado...
            </p>
          )}
          <ScrollArea className="h-85 lg:max-h=[calc(100vh-15rem)] pr-0 w-full flex-1">
            {reminder.map((item) => (
              <article
                key={item.id}
                className="flex flex-wrap flex-row items-center justify-between py-2 bg-yellow-100 mb-2 px-2 rounded-md"
              >
                <p className="text-sm lg:text-base">{item.description}</p>
                <Button
                  className="bg-red-500 hover:bg-red-400 shadow-none rounded-full p-2"
                  size="sm"
                  onClick={() => handleDeleteReminder(item.id)}
                >
                  <Trash className="w-4 h-4 text-white" />
                </Button>
              </article>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
