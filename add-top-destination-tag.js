const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addTopDestinationTag() {
  try {
    // Buscar el destino Patagonia
    const patagonia = await prisma.destination.findFirst({
      where: {
        OR: [
          { city: { contains: 'patagonia', mode: 'insensitive' } },
          { slug: { contains: 'patagonia', mode: 'insensitive' } }
        ]
      }
    });
    
    if (!patagonia) {
      console.log('No se encontró Patagonia');
      return;
    }
    
    console.log('Destino encontrado:', patagonia.city, patagonia.country, patagonia.slug);
    
    // Buscar la etiqueta top-destinations
    const topDestinationsTag = await prisma.tag.findFirst({
      where: { slug: 'top-destinations' }
    });
    
    if (!topDestinationsTag) {
      console.log('No se encontró la etiqueta top-destinations');
      return;
    }
    
    console.log('Etiqueta encontrada:', topDestinationsTag.slug);
    
    // Verificar si ya existe la relación
    const existingRelation = await prisma.destinationTag.findFirst({
      where: {
        destinationId: patagonia.id,
        tagId: topDestinationsTag.id
      }
    });
    
    if (existingRelation) {
      console.log('La relación ya existe');
      return;
    }
    
    // Crear la relación
    await prisma.destinationTag.create({
      data: {
        destinationId: patagonia.id,
        tagId: topDestinationsTag.id
      }
    });
    
    console.log('Etiqueta top-destinations agregada a Patagonia exitosamente');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addTopDestinationTag();
