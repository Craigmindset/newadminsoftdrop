"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NewSendPage() {
  const router = useRouter();
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/dashboard/send/carriers?pickup=${encodeURIComponent(pickupLocation)}&drop=${encodeURIComponent(dropLocation)}`);
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Send Item</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="pickup-location">Pickup Location</Label>
                <Input
                  id="pickup-location"
                  placeholder="Enter pickup address"
                  className="mt-1"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="drop-location">Drop Location</Label>
                <Input
                  id="drop-location"
                  placeholder="Enter delivery address"
                  className="mt-1"
                  value={dropLocation}
                  onChange={(e) => setDropLocation(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Continue to Carriers
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
