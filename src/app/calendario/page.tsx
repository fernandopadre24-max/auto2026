'use client';

import { PageHeader } from '@/components/page-header';
import { Card } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';

export default function CalendarioPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Calendário" />
      <Card className="flex justify-center p-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
      </Card>
    </div>
  );
}
