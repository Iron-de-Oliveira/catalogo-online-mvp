CREATE TABLE "produtos_favoritos" (
    "usuario_id" TEXT NOT NULL,
    "produto_id" INTEGER NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "produtos_favoritos_pkey" PRIMARY KEY ("usuario_id", "produto_id")
);

CREATE INDEX "produtos_favoritos_produto_id_idx"
ON "produtos_favoritos"("produto_id");

ALTER TABLE "produtos_favoritos"
ADD CONSTRAINT "produtos_favoritos_usuario_id_fkey"
FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "produtos_favoritos"
ADD CONSTRAINT "produtos_favoritos_produto_id_fkey"
FOREIGN KEY ("produto_id") REFERENCES "produtos"("id_produto")
ON DELETE CASCADE ON UPDATE CASCADE;
