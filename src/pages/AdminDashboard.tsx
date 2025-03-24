import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  getAdminFeedbackThunk,
  selectFeedbackThunk,
} from "@/features/admin/adminFeedbackSlice";
import { blockUserThunk, getUsersThunk } from "@/features/admin/adminSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  PieChart,
  User
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const dispatch = useAppDispatch();
  const { users, pagination } = useAppSelector(
    (state) => state.admin
  );
  const {
    feedbacks,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    status: _feedbackStatus,
    error: _feedbackError,
  } = useAppSelector((state) => state.adminFeedback);
  const [page, setPage] = useState(1);
  const limit = 10;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_activeTab, setActiveTab] = useState("users");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedFeedbackIds, setSelectedFeedbackIds] = useState<string[]>([]);

  useEffect(() => {
    dispatch(getUsersThunk({ page, limit }));
    // Fetch up to 50 feedback entries in one request
    dispatch(getAdminFeedbackThunk({ page: 1, limit: 50 }));
  }, [dispatch, page, limit]);

  const handleBlockUser = async (userId: string, userName: string) => {
    const confirmed = window.confirm(`Are you sure you want to block ${userName}?`);
    if (!confirmed) return;
    try {
      await dispatch(blockUserThunk(userId)).unwrap();
      toast.success(`${userName} has been blocked successfully.`);
    } catch (err: any) {
      toast.error(err.message || "Failed to block the user.");
    }
  };

  const handleFeedbackSelect = async (
    feedbackId: string,
    isSelected: boolean,
    userName: string
  ) => {
    console.log(feedbackId, isSelected, userName);
    let newSelected = [...selectedFeedbackIds];
    if (isSelected) {
      if (selectedFeedbackIds?.length >= 15) {
        alert("You cannot select more than 15 feedbacks.");
        return;
      }
      newSelected.push(feedbackId);
      try {
        await dispatch(
          selectFeedbackThunk({ feedbackId, adminSelected: true })
        ).unwrap();
        toast.success(`Feedback from ${userName} selected.`);
      } catch (err: any) {
        toast.error(err.message || "Failed to select feedback.");
      }
    } else {
      try {
        await dispatch(
          selectFeedbackThunk({ feedbackId, adminSelected: false })
        ).unwrap();
        toast.success(`Feedback from ${userName} unselected.`);
      } catch (err: any) {
        toast.error(err.message || "Failed to select feedback.");
      }
      newSelected = newSelected.filter((id) => id !== feedbackId);
    }
    setSelectedFeedbackIds(newSelected);
  };

  return (
    <div className="min-h-screen py-10 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          Admin Dashboard
        </h1>
        <Tabs defaultValue="users" onValueChange={(val) => setActiveTab(val)} className="w-full">
          <TabsList className="mb-6 bg-white dark:bg-gray-900 shadow rounded-lg">
            <TabsTrigger value="users" className="rounded-xl px-6 py-3">
              <User className="w-4 h-4 mr-2" /> Users
            </TabsTrigger>
            <TabsTrigger value="feedback" className="rounded-xl px-6 py-3">
              <PieChart className="w-4 h-4 mr-2" /> Feedback
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">User Management</h2>
                  <p className="text-sm text-gray-500">Manage all registered users</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-x-auto">
                  <table className="w-full min-w-[2000px] table-auto">
                    <thead className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      <tr>
                        {[
                          "User ID",
                          "Name",
                          "Email",
                          "Active",
                          "Blocked",
                          "Plan",
                          "Total Limit",
                          "Used Minutes",
                          "Subscription Start",
                          "Total Jobs",
                          "Completed",
                          "Failed",
                          "Minutes Used",
                          "Payment Total (INR)",
                          "Recent Payment Date",
                          "Actions",
                        ].map((header) => (
                          <th key={header} className="px-4 py-3 text-left text-sm font-medium">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {users.map((user) => {
                        const recentPayment = user.payments?.recent?.[0];
                        return (
                          <tr
                            key={user._id}
                            className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                            onClick={() => setSelectedUser(user)}
                          >
                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{user._id}</td>
                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{user.name}</td>
                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{user.email}</td>
                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{user.isActive ? "Yes" : "No"}</td>
                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{user.isBlocked ? "Yes" : "No"}</td>
                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{user.subscription?.planId?.name || "N/A"}</td>
                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{user.subscription?.totalLimit || "N/A"}</td>
                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{Number(user.subscription?.totalUsedMinutes).toFixed(1) || 0}</td>
                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                              {user.subscription?.startDate ? new Date(user.subscription.startDate).toLocaleString() : "N/A"}
                            </td>
                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{user.usage?.totalJobs || 0}</td>
                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{user.usage?.completedJobs || 0}</td>
                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{user.usage?.failedJobs || 0}</td>
                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                              {user.usage?.totalMinutesUsed?.toFixed(1) || "0.0"}
                            </td>
                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                              {user.payments?.total ? (user.payments.total / 100).toFixed(1) : "0.0"}
                            </td>
                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                              {recentPayment ? new Date(recentPayment.createdAt).toLocaleString() : "N/A"}
                            </td>
                            <td className="px-4 py-3">
                              {!user.isBlocked && (
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleBlockUser(user._id, user.name);
                                  }}
                                  className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
                                >
                                  Block
                                </Button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {pagination && (
                  <div className="mt-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-gray-600">
                      Showing {((page - 1) * limit) + 1} - {Math.min(page * limit, pagination.total)} of {pagination.total} users
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1} size="sm" className="border border-gray-300">
                        Previous
                      </Button>
                      <Button onClick={() => setPage((prev) => Math.min(prev + 1, Number(pagination.totalPages)))} disabled={page === Number(pagination.totalPages)} size="sm" className="border border-gray-300">
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Feedback Management</h2>
                <p className="text-sm text-gray-500">Select feedback entries (max 15) to mark as admin-selected</p>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-x-auto">
                  <table className="w-full min-w-[800px] table-auto">
                    <thead className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                      <tr>
                        {["User Name", "Rating", "Review", "Select"].map((header) => (
                          <th key={header} className="px-4 py-3 text-left text-sm font-medium">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {feedbacks.map((fb) => (
                        <tr key={fb._id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{fb.userName}</td>
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{fb.rating.toFixed(1)}</td>
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{fb.review}</td>
                          <td className="px-4 py-3">
                            <Checkbox
                              checked={fb.adminSelected || selectedFeedbackIds.includes(fb._id)}
                              onCheckedChange={(checked) =>
                                handleFeedbackSelect(fb._id, checked as boolean, fb.userName)
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {_feedbackError && <p className="mt-2 text-red-500">{_feedbackError}</p>}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* User Detail Dialog */}
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent className="max-w-2xl bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            {selectedUser && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selectedUser.avatar} />
                      <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
                    </Avatar>
                    {selectedUser.name}
                  </DialogTitle>
                </DialogHeader>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="font-medium">{selectedUser.email}</div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-sm text-gray-500">Status</div>
                    <div className="flex gap-2">
                      <Badge variant={selectedUser.isActive ? "default" : "destructive"}>
                        {selectedUser.isActive ? "Active" : "Inactive"}
                      </Badge>
                      {selectedUser.isBlocked && <Badge variant="destructive">Blocked</Badge>}
                    </div>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-sm text-gray-500">Plan</div>
                    <div className="font-medium">{selectedUser.subscription?.planId?.name || "N/A"}</div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-sm text-gray-500">Usage</div>
                    <div className="font-medium">
                      {selectedUser.usage?.totalMinutesUsed || 0}m / {selectedUser.subscription?.totalLimit || 0}m
                    </div>
                  </div>
                </div>
                <Separator className="my-4" />
                <div>
                  <h4 className="font-medium mb-2">Recent Payments</h4>
                  {selectedUser.payments?.recent?.map((p: any) => (
                    <div key={p._id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">₹{(p.amount / 100).toFixed(1)}</div>
                          <div className="text-sm text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</div>
                        </div>
                        <Badge variant={p.status === "paid" ? "default" : "destructive"}>
                          {p.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
