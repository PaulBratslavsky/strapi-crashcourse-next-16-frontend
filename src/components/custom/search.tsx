'use client'

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ISearchProps {
  readonly className?: string;
  readonly placeholder?: string;
}

export function Search({ className, placeholder = "Search" }: ISearchProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    console.log(`Searching... ${term}`);

    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <Input
      type="text"
      placeholder={placeholder}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
      defaultValue={searchParams.get('query') || ""}
      className={cn("", className)}
    />
  );
}