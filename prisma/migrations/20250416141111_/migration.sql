-- CreateTable
CREATE TABLE "order_attachments" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_attachments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "order_attachments" ADD CONSTRAINT "order_attachments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
