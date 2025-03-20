"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SortSelector({
  defaultValue,
}: {
  defaultValue: string
}) {
  return (
    <Select
      name="sort"
      defaultValue={defaultValue}
      onValueChange={() => {
        // This will submit the form when the value changes
        document.getElementById("sortForm")?.requestSubmit()
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Newest First</SelectItem>
        <SelectItem value="oldest">Oldest First</SelectItem>
      </SelectContent>
    </Select>
  )
}

