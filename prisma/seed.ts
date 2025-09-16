import { PrismaClient, QuoteStatus } from "@prisma/client";
import { addDays } from "date-fns";

const prisma = new PrismaClient();

const TEMPLATE_CATALOG = [
  {
    name: "Pintura residencial",
    category: "Pintura",
    description: "Incluye preparación de superficie, materiales y mano de obra.",
    items: [
      { description: "Preparación de superficies", quantity: 1, unit: "servicio", unitPrice: 180 },
      { description: "Pintura de muros interiores", quantity: 120, unit: "m2", unitPrice: 3.5 },
      { description: "Acabados y limpieza", quantity: 1, unit: "servicio", unitPrice: 90 }
    ],
    terms: "Incluye materiales certificados y garantía de 30 días.",
    notes: "Tiempo estimado de ejecución: 5 días hábiles."
  },
  {
    name: "Reparación de gasfitería",
    category: "Gasfitería",
    description: "Atención de emergencia y mantenimiento de tuberías.",
    items: [
      { description: "Diagnóstico de fuga", quantity: 1, unit: "visita", unitPrice: 65 },
      { description: "Reparación de tuberías", quantity: 3, unit: "hora", unitPrice: 35 },
      { description: "Reemplazo de accesorios", quantity: 2, unit: "unidad", unitPrice: 28 }
    ],
    terms: "Garantía de 60 días en mano de obra.",
    notes: "No incluye piezas adicionales no listadas."
  },
  {
    name: "Campaña de marketing digital",
    category: "Marketing",
    description: "Plan mensual con pauta y contenido.",
    items: [
      { description: "Gestión de pauta en redes", quantity: 1, unit: "mes", unitPrice: 250 },
      { description: "Diseño y contenido", quantity: 4, unit: "piezas", unitPrice: 45 },
      { description: "Reporte y optimización", quantity: 1, unit: "mes", unitPrice: 80 }
    ],
    terms: "Incluye hasta 2 iteraciones de contenido por semana.",
    notes: "Recomendado invertir mínimo USD 150 en pauta."
  },
  {
    name: "Clases particulares",
    category: "Clases",
    description: "Pack de tutorías personalizadas.",
    items: [
      { description: "Sesiones personalizadas", quantity: 8, unit: "hora", unitPrice: 18 },
      { description: "Material de apoyo", quantity: 1, unit: "pack", unitPrice: 20 },
      { description: "Seguimiento", quantity: 1, unit: "mes", unitPrice: 35 }
    ],
    terms: "Las sesiones pueden reagendarse con 24h de anticipación.",
    notes: "Incluye reporte de progreso quincenal."
  },
  {
    name: "Plan de limpieza recurrente",
    category: "Limpieza",
    description: "Servicio semanal para oficinas pequeñas.",
    items: [
      { description: "Limpieza profunda inicial", quantity: 1, unit: "servicio", unitPrice: 150 },
      { description: "Limpieza semanal", quantity: 4, unit: "servicio", unitPrice: 70 },
      { description: "Suministros", quantity: 1, unit: "mes", unitPrice: 45 }
    ],
    terms: "Incluye productos biodegradables.",
    notes: "Horarios ajustables según disponibilidad."
  }
];

async function main() {
  const ownerEmail = process.env.SEED_OWNER_EMAIL ?? "owner@example.com";
  const ownerName = process.env.SEED_OWNER_NAME ?? "Demo Owner";

  // TODO: Integrate with external auth provider (Clerk/Auth.js). For ahora seed de un Owner demo.
  const owner = await prisma.user.upsert({
    where: { email: ownerEmail },
    update: { name: ownerName },
    create: {
      email: ownerEmail,
      name: ownerName
    }
  });

  const clients = [
    { name: "Constructora Norte", email: "compras@constructoranorte.test", phone: "+56911111111", company: "Constructora Norte" },
    { name: "Comercial Rivera", email: "ceo@rivera.test", phone: "+56922222222", company: "Comercial Rivera" }
  ];

  for (const client of clients) {
    const existing = await prisma.client.findFirst({
      where: {
        ownerId: owner.id,
        OR: [
          { email: client.email ?? undefined },
          { name: client.name }
        ]
      }
    });

    if (existing) {
      await prisma.client.update({
        where: { id: existing.id },
        data: client
      });
    } else {
      await prisma.client.create({
        data: {
          ...client,
          ownerId: owner.id
        }
      });
    }
  }

  for (const template of TEMPLATE_CATALOG) {
    const existing = await prisma.template.findFirst({
      where: {
        ownerId: owner.id,
        name: template.name
      }
    });

    if (existing) {
      await prisma.template.update({
        where: { id: existing.id },
        data: {
          category: template.category,
          description: template.description,
          items: template.items,
          terms: template.terms,
          notes: template.notes
        }
      });
    } else {
      await prisma.template.create({
        data: {
          ownerId: owner.id,
          ...template
        }
      });
    }
  }

  const [client] = await prisma.client.findMany({ where: { ownerId: owner.id }, take: 1 });
  const [template] = await prisma.template.findMany({ where: { ownerId: owner.id, category: "Pintura" }, take: 1 });

  if (client && template) {
    const expiresAt = addDays(new Date(), 7);
    await prisma.quote.upsert({
      where: {
        reference: "Q-0001"
      },
      update: {
        ownerId: owner.id,
        clientId: client.id,
        templateId: template.id,
        expiresAt
      },
      create: {
        ownerId: owner.id,
        clientId: client.id,
        templateId: template.id,
        reference: "Q-0001",
        title: "Servicio de pintura interior",
        summary: "Remodelación de interiores para departamento familiar.",
        publicSlug: "demo-q-0001",
        status: QuoteStatus.SENT,
        sentAt: new Date(),
        expiresAt,
        subtotal: 590,
        tax: 0,
        total: 590,
        terms: template.terms,
        notes: template.notes,
        items: {
          create: template.items.map((item, index) => ({
            description: item.description,
            quantity: item.quantity,
            unit: item.unit,
            unitPrice: item.unitPrice,
            position: index
          }))
        },
        activities: {
          create: [
            {
              type: "STATUS_CHANGE",
              description: "Cotización enviada al cliente"
            }
          ]
        }
      }
    });
  }

  console.log("✅ Seed completed");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
