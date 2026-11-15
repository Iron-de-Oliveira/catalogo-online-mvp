CREATE TABLE "produto_imagens" (
    "id_imagem" SERIAL NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "ordem" INTEGER NOT NULL,
    "id_produto" INTEGER NOT NULL,

    CONSTRAINT "produto_imagens_pkey" PRIMARY KEY ("id_imagem")
);

INSERT INTO "produto_imagens" ("url", "ordem", "id_produto")
SELECT "foto", 0, "id_produto"
FROM "produtos";

CREATE INDEX "produto_imagens_id_produto_ordem_idx"
ON "produto_imagens"("id_produto", "ordem");

ALTER TABLE "produto_imagens"
ADD CONSTRAINT "produto_imagens_id_produto_fkey"
FOREIGN KEY ("id_produto") REFERENCES "produtos"("id_produto")
ON DELETE CASCADE ON UPDATE CASCADE;
