-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" UUID NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT,
    "user_id" UUID NOT NULL,
    "resource_type" TEXT,
    "resourceId" TEXT,
    "payload_data" JSONB,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
