"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data - replace with actual data fetching

export default function SendersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [transactionFilter, setTransactionFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSender, setSelectedSender] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    username: "",
    phoneNumber: "",
    email: "",
  });
  
  const [allSenders, setAllSenders] = useState<any[]>([])

  useEffect(() => {
    let active = true;
    const cacheKey = "admin:senders:v1";

    async function loadSenders() {
      try {
        const cachedRaw = sessionStorage.getItem(cacheKey);
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw);
          if (active && Array.isArray(cached?.data)) {
            setAllSenders(cached.data);
          }
        }
      } catch (error) {
        console.error("Failed to read cached senders", error);
      }

      const response = await fetch("/api/admin/senders");
      if (!response.ok) {
        return;
      }

      const payload = await response.json();
      if (!active) {
        return;
      }

      const nextData = payload.data || [];
      setAllSenders(nextData);

      try {
        sessionStorage.setItem(
          cacheKey,
          JSON.stringify({ data: nextData, fetchedAt: Date.now() }),
        );
      } catch (error) {
        console.error("Failed to cache senders", error);
      }
    }

    loadSenders();

    return () => {
      active = false;
    };
  }, []);
  // Array.from({ length: 45 }, (_, i) => ({
  //   id: `sender-${i + 1}`,
  //   profileImage: `https://api.dicebear.com/7.x/avatars/svg?seed=${i}`,
  //   username: `sender${i + 1}`,
  //   phoneNumber: `+234${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
  //   email: `sender${i + 1}@example.com`,
  //   role: "Sender",
  //   joined: new Date(
  //     2023 + Math.floor(Math.random() * 2),
  //     Math.floor(Math.random() * 12),
  //     Math.floor(Math.random() * 28) + 1
  //   ).toLocaleDateString(),
  //   isCarrier: Math.random() > 0.5,
  //   transactions: Math.floor(Math.random() * 100),
  //   gender: Math.random() > 0.5 ? "Male" : "Female",
  //   state: ["Lagos", "Abuja", "Kano", "Rivers", "Oyo"][
  //     Math.floor(Math.random() * 5)
  //   ],
  // }));

  const itemsPerPage = 20;

  // Filter senders
  const filteredSenders = useMemo(() =>
    allSenders?.filter((sender: any) => {
      const matchesSearch =
        sender?.first_name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        sender?.last_name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        sender?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sender?.phone_number?.includes(searchQuery);

      const matchesGender =
        genderFilter === "all" ||
        String(sender?.gender || "").toLowerCase() ===
          genderFilter.toLowerCase();
      const matchesState = stateFilter === "all" || sender.state === stateFilter;
      const transactions = Number(sender?.transactions || 0);
      const matchesTransaction =
        transactionFilter === "all" ||
        (transactionFilter === "high" && transactions >= 50) ||
        (transactionFilter === "medium" &&
          transactions >= 20 &&
          transactions < 50) ||
        (transactionFilter === "low" && transactions < 20);

      return matchesSearch && matchesGender && matchesState && matchesTransaction;
    }),
    [allSenders, genderFilter, searchQuery, stateFilter, transactionFilter],
  );

  // Pagination
  const totalPages = Math.ceil(filteredSenders?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSenders = filteredSenders?.slice(startIndex, endIndex);

  const handleDelete = (sender: any) => {
    setSelectedSender(sender);
    setDeleteDialogOpen(true);
  };

  const handleEdit = (sender: any) => {
    setSelectedSender(sender);
    setEditForm({
      username: sender.username,
      phoneNumber: sender.phoneNumber,
      email: sender.email,
    });
    setEditDialogOpen(true);
  };

  const confirmDelete = () => {
    // Handle delete logic here
    console.log("Deleting sender:", selectedSender.id);
    setDeleteDialogOpen(false);
    setSelectedSender(null);
  };

  const confirmEdit = () => {
    // Handle edit logic here
    console.log("Editing sender:", selectedSender.id, editForm);
    setEditDialogOpen(false);
    setSelectedSender(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Senders</h1>
        <p className="text-gray-500">
          Manage and view all senders on the platform
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Senders</CardTitle>
          <CardDescription>
            Total: {filteredSenders?.length} sender
            {filteredSenders?.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={genderFilter} onValueChange={setGenderFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                <SelectItem value="Lagos">Lagos</SelectItem>
                <SelectItem value="Abuja">Abuja</SelectItem>
                <SelectItem value="Kano">Kano</SelectItem>
                <SelectItem value="Rivers">Rivers</SelectItem>
                <SelectItem value="Oyo">Oyo</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={transactionFilter}
              onValueChange={setTransactionFilter}
            >
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Transactions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="high">High (50+)</SelectItem>
                <SelectItem value="medium">Medium (20-49)</SelectItem>
                <SelectItem value="low">Low (&lt;20)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Profile</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Also Carrier</TableHead>
                  <TableHead>Transactions</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentSenders?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="text-center py-8 text-gray-500"
                    >
                      No senders found
                    </TableCell>
                  </TableRow>
                ) : (
                  currentSenders?.map((sender: any) => (
                    <TableRow key={sender.id}>
                      <TableCell>
                        <Avatar>
                          <AvatarImage
                            src={sender.profile_image || ""}
                            alt={`${sender.first_name || ""} ${
                              sender.last_name || ""
                            }`.trim() || "Sender"}
                          />
                          <AvatarFallback className="bg-gray-200">
                            <UserIcon className="h-5 w-5 text-gray-500" />
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">
                        {`${sender.first_name || ""} ${
                          sender.last_name || ""
                        }`.trim() || "-"}
                      </TableCell>
                      <TableCell>{sender.phone_number || "-"}</TableCell>
                      <TableCell>{sender.email}</TableCell>
                      <TableCell>{sender.state}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {sender.role || "Sender"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {sender.created_at
                          ? new Date(sender.created_at).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={sender.is_carrier ? "default" : "outline"}>
                          {sender.is_carrier ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell>{sender.transactions || 0}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/admin/dashboard/senders/${sender.id}`}
                                className="cursor-pointer"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEdit(sender)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(sender)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredSenders?.length)} of{" "}
                {filteredSenders?.length} results
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              sender account for{" "}
              <span className="font-semibold">{selectedSender?.username}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update sender information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={editForm.username}
                onChange={(e) =>
                  setEditForm({ ...editForm, username: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={editForm.phoneNumber}
                onChange={(e) =>
                  setEditForm({ ...editForm, phoneNumber: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
