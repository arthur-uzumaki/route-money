import { hash } from 'bcrypt'
import { db } from './connection.ts'
import { schema } from './schema/index.ts'

async function seed() {
  console.log('🌱 Iniciando seed do banco de dados...')
  const passwordHash = await hash('123456789', 8)
  try {
    // await db.delete(schema.rides)
    // await db.delete(schema.platform)
    // await db.delete(schema.user)

    // 1. Criar usuários
    console.log('👥 Criando usuários...')
    const users = await db
      .insert(schema.user)
      .values([
        {
          name: 'John Doe',
          email: 'johndoe@example.com',
          password: passwordHash,
        },
        {
          name: 'Maria Silva',
          email: 'maria@example.com',
          password: passwordHash,
        },
        {
          name: 'Pedro Santos',
          email: 'pedro@example.com',
          password: passwordHash,
        },
        {
          name: 'Ana Costa',
          email: 'ana@example.com',
          password: passwordHash,
        },
        {
          name: 'Carlos Oliveira',
          email: 'carlos@example.com',
          password: passwordHash,
        },
        {
          name: 'Juliana Souza',
          email: 'juliana@example.com',
          password: passwordHash,
        },
        {
          name: 'Roberto Lima',
          email: 'roberto@example.com',
          password: passwordHash,
        },
        {
          name: 'Fernanda Rocha',
          email: 'fernanda@example.com',
          password: passwordHash,
        },
      ])
      .returning()

    console.log(`✅ ${users.length} usuários criados`)

    // 2. Criar plataformas
    console.log('🚗 Criando plataformas...')
    const platforms = await db
      .insert(schema.platform)
      .values([
        { name: 'Uber', color: '#000000' },
        { name: '99', color: '#FFD500' },
        { name: 'InDrive', color: '#00B2A9' },
        { name: 'Uber Eats', color: '#06C167' },
        { name: 'iFood', color: '#EA1D2C' },
        { name: 'Rappi', color: '#FF2D55' },
      ])
      .returning()

    console.log(`✅ ${platforms.length} plataformas criadas`)

    // 3. Criar corridas e entregas
    console.log('📦 Criando corridas e entregas...')
    console.log('📦 Criando corridas e entregas...')

    const ridesData: Array<typeof schema.rides.$inferInsert> = []
    const now = new Date()

    // Gerar corridas/entregas para cada usuário
    for (const u of users) {
      // Gerar entre 50 e 150 registros por usuário
      const numRides = Math.floor(Math.random() * 100) + 50

      for (let i = 0; i < numRides; i++) {
        // Data aleatória nos últimos 90 dias
        const daysAgo = Math.floor(Math.random() * 90)
        const rideDate = new Date(now)
        rideDate.setDate(rideDate.getDate() - daysAgo)
        rideDate.setHours(
          Math.floor(Math.random() * 24),
          Math.floor(Math.random() * 60),
          0,
          0
        )

        // Tipo aleatório (60% corrida, 40% entrega)
        const type: 'corrida' | 'entrega' =
          Math.random() < 0.6 ? 'corrida' : 'entrega'

        // Plataforma aleatória (priorizar Uber/99 para corridas, iFood/Uber Eats para entregas)
        let platformIndex: number
        if (type === 'corrida') {
          platformIndex =
            Math.random() < 0.8
              ? Math.floor(Math.random() * 3)
              : Math.floor(Math.random() * 6)
        } else {
          platformIndex =
            Math.random() < 0.8
              ? Math.floor(Math.random() * 3) + 3
              : Math.floor(Math.random() * 6)
        }

        // Valores realistas
        const grossValue =
          type === 'corrida'
            ? (Math.random() * 50 + 10).toFixed(2) // R$ 10-60
            : (Math.random() * 30 + 8).toFixed(2) // R$ 8-38

        const feePercentage = Math.random() * 0.15 + 0.15 // 15%-30%
        const feeValue = (parseFloat(grossValue) * feePercentage).toFixed(2)
        const netValue = (
          parseFloat(grossValue) - parseFloat(feeValue)
        ).toFixed(2)

        // Duração em minutos
        const durationMinutes =
          type === 'corrida'
            ? Math.floor(Math.random() * 40) + 10 // 10-50 min
            : Math.floor(Math.random() * 25) + 5 // 5-30 min

        // Notas aleatórias (10% das corridas tem notas)
        const notes =
          Math.random() < 0.1
            ? [
                'Cliente muito simpático',
                'Trânsito pesado',
                'Entrega rápida',
                'Problema com endereço',
                'Cliente deixou gorjeta',
              ][Math.floor(Math.random() * 5)]
            : undefined

        ridesData.push({
          type,
          rideDate,
          grossValues: grossValue,
          feeValue,
          netValue,
          durationMinutes,
          notes,
          userId: u.id,
          platformId: platforms[platformIndex].id,
        })
      }
    }

    // Inserir em lotes de 500 para melhor performance
    const batchSize = 500
    for (let i = 0; i < ridesData.length; i += batchSize) {
      const batch = ridesData.slice(i, i + batchSize)
      await db.insert(schema.rides).values(batch)
      console.log(
        `  📊 Inseridos ${Math.min(i + batchSize, ridesData.length)}/${ridesData.length} registros...`
      )
    }

    console.log(`✅ ${ridesData.length} corridas/entregas criadas`)
    console.log('\n🎉 Seed concluído com sucesso!')

    // Estatísticas
    console.log('\n📈 Estatísticas:')
    console.log(`  • Usuários: ${users.length}`)
    console.log(`  • Plataformas: ${platforms.length}`)
    console.log(`  • Corridas/Entregas: ${ridesData.length}`)
    console.log(
      `  • Média por usuário: ${Math.floor(ridesData.length / users.length)}`
    )
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error)
    throw error
  }
}

// Executar seed
seed()
  .then(() => {
    console.log('✨ Processo finalizado')
    process.exit(0)
  })
  .catch(error => {
    console.error('💥 Falha no seed:', error)
    process.exit(1)
  })
