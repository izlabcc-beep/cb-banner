import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Save, Clock, Plus } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export interface Template {
    id: string;
    name: string;
    createdAt: number;
    state: any; // Using any for brevity here, but ideally should be the BannerState type
}

interface TemplatesDialogProps {
    isOpen: boolean;
    onClose: () => void;
    templates: Template[];
    onSave: (name: string) => void;
    onLoad: (template: Template) => void;
    onDelete: (id: string) => void;
    initialMode?: "list" | "save";
}

export const TemplatesDialog = ({
    isOpen,
    onClose,
    templates,
    onSave,
    onLoad,
    onDelete,
    initialMode = "list",
}: TemplatesDialogProps) => {
    const [newTemplateName, setNewTemplateName] = useState("");
    const [mode, setMode] = useState<"list" | "save">(initialMode);
    const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setMode(initialMode);
            setNewTemplateName("");
            setTemplateToDelete(null);
        }
    }, [isOpen, initialMode]);

    const handleSave = () => {
        if (!newTemplateName.trim()) return;
        onSave(newTemplateName);
        setNewTemplateName("");
        setMode("list");
    };

    const confirmDelete = () => {
        if (templateToDelete) {
            onDelete(templateToDelete);
            setTemplateToDelete(null);
        }
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{mode === "save" ? "Сохранить шаблон" : "Мои шаблоны"}</DialogTitle>
                        <DialogDescription>
                            {mode === "save"
                                ? "Введите название для нового шаблона"
                                : "Выберите шаблон для загрузки или создайте новый"}
                        </DialogDescription>
                    </DialogHeader>

                    {mode === "save" ? (
                        <div className="space-y-4 py-4">
                            <Input
                                placeholder="Название шаблона..."
                                value={newTemplateName}
                                onChange={(e) => setNewTemplateName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSave();
                                }}
                                autoFocus
                            />
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setMode("list")}>
                                    Отмена
                                </Button>
                                <Button onClick={handleSave} disabled={!newTemplateName.trim()}>
                                    Сохранить
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <Button
                                className="w-full justify-start gap-2"
                                onClick={() => setMode("save")}
                                variant="outline"
                            >
                                <Plus className="h-4 w-4" />
                                Сохранить текущее состояние как шаблон
                            </Button>

                            <div className="text-sm font-medium text-muted-foreground mt-4 mb-2">
                                Сохраненные ({templates.length})
                            </div>

                            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                                {templates.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm">
                                        <Save className="h-8 w-8 mb-2 opacity-20" />
                                        <p>Нет сохраненных шаблонов</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {templates.map((template) => (
                                            <div
                                                key={template.id}
                                                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors group"
                                            >
                                                <div className="flex flex-col gap-1 min-w-0 flex-1 cursor-pointer" onClick={() => onLoad(template)}>
                                                    <span className="font-medium truncate">{template.name}</span>
                                                    <div className="flex items-center text-xs text-muted-foreground gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {format(template.createdAt, "d MMM yyyy, HH:mm", { locale: ru })}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-[8px] text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setTemplateToDelete(template.id);
                                                        }}
                                                        title="Удалить"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!templateToDelete} onOpenChange={(open) => !open && setTemplateToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Удалить шаблон?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Вы уверены, что хотите удалить этот шаблон? Это действие нельзя отменить.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Удалить
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};
