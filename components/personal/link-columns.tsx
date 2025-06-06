"use client";

import { paths } from "@/config/page";
import { Link, Locale } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { enUS, vi } from "date-fns/locale";
import { Ellipsis } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { SortButton } from "../SortButton";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { DeleteLink } from "./DeleteLink";
import capitalize from 'lodash/capitalize';

//=============================================================================//
export const useLinkColumns = (): ColumnDef<Link>[] => {
  const t = useTranslations("Profile.LinkTable");
  const locale = useLocale();
  return [
    {
      accessorKey: "original",
      header: ({ column }) => (
        <div className="flex items-center gap-2">
          <span>{t("original")}</span>
          <SortButton column={column} />
        </div>
      ),
      enableResizing: false,
      cell: ({ row }) => (
        <a className="inline-block max-w-xs truncate">
          {row.original.original}
        </a>
      ),
    },
    {
      accessorKey: "path",
      header: () => <span className="block text-center">{t("path")}</span>,
      cell: ({ row }) => {
        const path = `${process.env.NEXT_PUBLIC_BASE_URL}${paths.l}/${row.original.path}`;
        return (
          <div className="flex justify-center">
            <CopyToolTip value={path} label={t("path")}>
              <a
                href={path}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-block max-w-sm text-center truncate hover:underline"
              >
                {path}
              </a>
            </CopyToolTip>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <div className="flex items-center justify-center gap-2">
          <span className="block text-center">{t("createdAt")}</span>
          <SortButton column={column} />
        </div>
      ),
      cell: ({ row }) => {
        const now = format(row.original.createdAt, "dd/MM/yyyy HH:mm:ss", {
          locale: locale === "vi" ? vi : enUS,
        });
        return <span className="block text-center">{now}</span>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="size-9 rounded-xs">
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="p-0 mt-1 rounded-none bg-background">
              <DeleteLink id={row.original.id} />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};

type CopyToolTipProps = React.ComponentProps<"div"> & {
  label: string;
  value: string;
  children: React.ReactNode;
};
const CopyToolTip: React.FC<CopyToolTipProps> = ({
  value,
  label,
  children,
  ...props
}) => {
  const t = useTranslations("Profile.LinkTable");
  const locale = useLocale();
  const handleCopy = async () => {
    const { toast } = await import("sonner");
    await navigator.clipboard.writeText(value);

    toast.success(t("copyToast", { item: locale as Locale === 'vi' ? label.toLocaleLowerCase() : capitalize(label) }));
  };
  return (
    <Tooltip delayDuration={1}>
      <TooltipTrigger asChild>
        <span className="cursor-pointer">{children}</span>
      </TooltipTrigger>
      <TooltipContent
        className="pointer-events-auto"
        side="top"
        align="start"
        {...props}
      >
        <span className="text-sm cursor-pointer" onClick={handleCopy}>
          Copy {label.toLowerCase()}
        </span>
      </TooltipContent>
    </Tooltip>
  );
};
