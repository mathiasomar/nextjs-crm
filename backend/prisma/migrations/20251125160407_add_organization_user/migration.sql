-- CreateTable
CREATE TABLE "OrganizationUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrganizationUser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrganizationUser" ADD CONSTRAINT "OrganizationUser_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
