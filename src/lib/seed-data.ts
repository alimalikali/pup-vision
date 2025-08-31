import { PrismaClient } from '@prisma/client'
import { passwordUtils } from '@/lib/jwt'

const prisma = new PrismaClient()

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...')

    // Create sample users
    const user1 = await prisma.user.upsert({
      where: { email: 'john@example.com' },
      update: {},
      create: {
        email: 'john@example.com',
        passwordHash: await passwordUtils.hashPassword('password123'),
        role: 'USER',
        isVerified: true,
        profile: {
          create: {
            name: 'John Doe',
            avatar: '/professional-man.png',
            dob: new Date('1990-05-15'),
            gender: 'MALE',
            income: 85000,
            religion: 'CHRISTIANITY',
            education: 'BACHELORS',
            profession: 'SOFTWARE_DEVELOPMENT',
            city: 'San Francisco',
            state: 'California',
            country: 'USA',
            purposeDomain: 'TECHNOLOGICAL',
            purposeArchetype: 'CREATOR',
            purposeModality: 'INDIVIDUAL',
            purposeNarrative: 'Building meaningful technology that connects people and solves real-world problems',
            interests: ['TECHNOLOGY', 'MUSIC', 'TRAVEL'],
            personality: 'INTROVERT',
            maritalStatus: 'SINGLE',
            lookingFor: 'SINGLE',
            language: 'ENGLISH',
            height: 175,
            weight: 70,
            smoke: 'NO',
            alcohol: 'OCCASIONALLY',
            drugs: 'NO',
            politics: ['CENTER'],
            isNew: false,
            isActive: true
          }
        }
      }
    })

    const user2 = await prisma.user.upsert({
      where: { email: 'sarah@example.com' },
      update: {},
      create: {
        email: 'sarah@example.com',
        passwordHash: await passwordUtils.hashPassword('password123'),
        role: 'USER',
        isVerified: true,
        profile: {
          create: {
            name: 'Sarah Chen',
            avatar: '/professional-woman-smiling.png',
            dob: new Date('1992-08-22'),
            gender: 'FEMALE',
            income: 95000,
            religion: 'BUDDHISM',
            education: 'MASTERS',
            profession: 'DATA_SCIENCE',
            city: 'Austin',
            state: 'Texas',
            country: 'USA',
            purposeDomain: 'TECHNOLOGICAL',
            purposeArchetype: 'VISIONARY',
            purposeModality: 'COMMUNITY',
            purposeNarrative: 'Using data science to create positive social impact and drive innovation',
            interests: ['TECHNOLOGY', 'READING', 'COOKING'],
            personality: 'AMBIVERT',
            maritalStatus: 'SINGLE',
            lookingFor: 'SINGLE',
            language: 'ENGLISH',
            height: 165,
            weight: 58,
            smoke: 'NO',
            alcohol: 'NO',
            drugs: 'NO',
            politics: ['LEFT'],
            isNew: false,
            isActive: true
          }
        }
      }
    })

    const user3 = await prisma.user.upsert({
      where: { email: 'michael@example.com' },
      update: {},
      create: {
        email: 'michael@example.com',
        passwordHash: await passwordUtils.hashPassword('password123'),
        role: 'USER',
        isVerified: true,
        profile: {
          create: {
            name: 'Michael Rodriguez',
            avatar: '/professional-engineer.png',
            dob: new Date('1988-12-10'),
            gender: 'MALE',
            income: 120000,
            religion: 'CHRISTIANITY',
            education: 'PHD',
            profession: 'ENGINEERING',
            city: 'New York',
            state: 'New York',
            country: 'USA',
            purposeDomain: 'ENVIRONMENTAL',
            purposeArchetype: 'ADVOCATE',
            purposeModality: 'GLOBAL',
            purposeNarrative: 'Developing sustainable engineering solutions for a better future',
            interests: ['TECHNOLOGY', 'SPORTS', 'ART'],
            personality: 'EXTROVERT',
            maritalStatus: 'SINGLE',
            lookingFor: 'SINGLE',
            language: 'ENGLISH',
            height: 180,
            weight: 75,
            smoke: 'NO',
            alcohol: 'OCCASIONALLY',
            drugs: 'NO',
            politics: ['RIGHT'],
            isNew: false,
            isActive: true
          }
        }
      }
    })

    // Create sample matches
    const match1 = await prisma.match.upsert({
      where: { id: 'match-1' },
      update: {},
      create: {
        id: 'match-1',
        userAId: user1.id,
        userBId: user2.id,
        compatibilityScore: 92.5,
        status: 'PENDING',
        initiatedById: user1.id
      }
    })

    const match2 = await prisma.match.upsert({
      where: { id: 'match-2' },
      update: {},
      create: {
        id: 'match-2',
        userAId: user2.id,
        userBId: user3.id,
        compatibilityScore: 88.0,
        status: 'INTERESTED',
        initiatedById: user2.id
      }
    })

    const match3 = await prisma.match.upsert({
      where: { id: 'match-3' },
      update: {},
      create: {
        id: 'match-3',
        userAId: user3.id,
        userBId: user1.id,
        compatibilityScore: 85.5,
        status: 'PENDING',
        initiatedById: user3.id
      }
    })

    // Create sample subscriptions
    const subscription1 = await prisma.subscription.upsert({
      where: { id: 'sub-1' },
      update: {},
      create: {
        id: 'sub-1',
        userId: user1.id,
        plan: 'PREMIUM',
        status: 'ACTIVE',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31')
      }
    })

    const subscription2 = await prisma.subscription.upsert({
      where: { id: 'sub-2' },
      update: {},
      create: {
        id: 'sub-2',
        userId: user2.id,
        plan: 'FREE',
        status: 'ACTIVE',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-03-01')
      }
    })

    // Create sample transactions
    await prisma.transaction.upsert({
      where: { id: 'txn-1' },
      update: {},
      create: {
        id: 'txn-1',
        subscriptionId: subscription1.id,
        amount: 29.99,
        currency: 'USD',
        paymentMethod: 'CARD',
        status: 'SUCCESS',
        transactionId: 'txn_123456789'
      }
    })

    await prisma.transaction.upsert({
      where: { id: 'txn-2' },
      update: {},
      create: {
        id: 'txn-2',
        subscriptionId: subscription1.id,
        amount: 29.99,
        currency: 'USD',
        paymentMethod: 'CARD',
        status: 'SUCCESS',
        transactionId: 'txn_987654321'
      }
    })

    console.log('✅ Database seeded successfully!')
    console.log('📊 Created:')
    console.log(`   - ${3} users with profiles`)
    console.log(`   - ${3} matches`)
    console.log(`   - ${2} subscriptions`)
    console.log(`   - ${2} transactions`)

  } catch (error) {
    console.error('❌ Error seeding database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
}

export { seedDatabase }
