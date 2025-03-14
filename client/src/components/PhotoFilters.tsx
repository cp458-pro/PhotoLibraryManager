import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { type DateRange } from "react-day-picker";

interface PhotoFilters {
  dateRange: DateRange | null;
  location: string;
  tags: string[];
}

interface FiltersProps {
  filters: PhotoFilters;
  onChange: (filters: PhotoFilters) => void;
}

export default function PhotoFilters({ filters, onChange }: FiltersProps) {
  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Date Range</Label>
            <DateRangePicker
              value={filters.dateRange}
              onChange={(range) =>
                onChange({ ...filters, dateRange: range })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              value={filters.location}
              onChange={(e) =>
                onChange({ ...filters, location: e.target.value })
              }
              placeholder="Filter by location"
            />
          </div>
          <div className="space-y-2">
            <Label>Tags</Label>
            <Input
              value={filters.tags.join(", ")}
              onChange={(e) =>
                onChange({
                  ...filters,
                  tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                })
              }
              placeholder="Filter by tags (comma-separated)"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}