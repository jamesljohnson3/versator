import type { Metadata } from "next";

import * as React from "react";
import { z } from "zod";

import type { SearchParams } from "~/types";

import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/components/page-header";
import { Shell } from "~/components/shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { env } from "~/env.js";
import { getNotification } from "~/lib/queries/notification";
import { getCachedUser } from "~/lib/queries/user";
import { getUserEmail } from "~/lib/utils";

import { UpdateNotificationForm } from "./_components/update-notification-form";
import { UpdateNotificationFormSkeleton } from "./_components/update-notification-form-skeleton";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "Settings",
  description: "Manage your settings",
};

type SettingsPageProps = {
  searchParams: Promise<SearchParams>;
};

const schema = z.object({
  token: z.string().optional(),
});

export default async function SettingsPage({
  searchParams,
}: SettingsPageProps) {
  // Await searchParams to handle its asynchronous nature
  const params = await searchParams;
  const { token } = schema.parse(params);

  const user = await getCachedUser();

  const notificationPromise = getNotification({
    token,
    email: getUserEmail(user),
  });

  return (
    <Shell variant="sidebar">
      <PageHeader>
        <PageHeaderHeading size="sm">Settings</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Manage your store settings
        </PageHeaderDescription>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Email Preferences</CardTitle>
          <CardDescription>Manage your email preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <React.Suspense fallback={<UpdateNotificationFormSkeleton />}>
            <UpdateNotificationForm notificationPromise={notificationPromise} />
          </React.Suspense>
        </CardContent>
      </Card>
    </Shell>
  );
}