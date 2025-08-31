const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const sampleUsers = [
  {
    email: 'admin@pup.com',
    password: 'admin123',
    role: 'ADMIN',
    profile: {
      name: 'Admin User',
      gender: 'OTHER',
      religion: 'OTHER',
      education: 'MASTERS',
      profession: 'SOFTWARE_DEVELOPMENT',
      purposeDomain: 'TECHNOLOGICAL',
      purposeArchetype: 'LEADER',
      purposeModality: 'GLOBAL',
      purposeNarrative: 'Building technology solutions for social impact',
      personality: 'EXTROVERT',
      maritalStatus: 'SINGLE',
      lookingFor: 'SINGLE',
      language: 'ENGLISH',
      smoke: 'NO',
      alcohol: 'OCCASIONALLY',
      drugs: 'NO',
      politics: ['CENTER'],
      interests: ['TECHNOLOGY', 'READING', 'TRAVEL'],
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      isNew: false
    }
  },
  {
    email: 'sarah.ahmed@pup.com',
    password: 'password123',
        role: 'USER',
        profile: {
      name: 'Sarah Ahmed',
      gender: 'FEMALE',
      religion: 'ISLAM',
            education: 'BACHELORS',
      profession: 'MEDICINE',
      purposeDomain: 'SOCIAL',
      purposeArchetype: 'HEALER',
      purposeModality: 'COMMUNITY',
      purposeNarrative: 'Dedicated to providing healthcare access to underserved communities',
      personality: 'AMBIVERT',
      maritalStatus: 'SINGLE',
      lookingFor: 'SINGLE',
      language: 'ENGLISH',
      smoke: 'NO',
      alcohol: 'NO',
      drugs: 'NO',
      politics: ['LEFT'],
      interests: ['COOKING', 'TRAVEL', 'READING'],
      city: 'New York',
      state: 'NY',
            country: 'USA',
      isNew: false
    }
  },
  {
    email: 'michael.chen@pup.com',
    password: 'password123',
    role: 'USER',
    profile: {
      name: 'Michael Chen',
      gender: 'MALE',
      religion: 'BUDDHISM',
      education: 'MASTERS',
      profession: 'ENGINEERING',
      purposeDomain: 'ENVIRONMENTAL',
            purposeArchetype: 'CREATOR',
      purposeModality: 'GLOBAL',
      purposeNarrative: 'Creating sustainable technology solutions for environmental challenges',
            personality: 'INTROVERT',
            maritalStatus: 'SINGLE',
            lookingFor: 'SINGLE',
            language: 'ENGLISH',
            smoke: 'NO',
            alcohol: 'OCCASIONALLY',
      drugs: 'NO',
      politics: ['LEFT'],
      interests: ['TECHNOLOGY', 'ART', 'MUSIC'],
      city: 'Seattle',
      state: 'WA',
      country: 'USA',
      isNew: false
    }
  },
  {
    email: 'fatima.khan@pup.com',
    password: 'password123',
    role: 'USER',
    profile: {
      name: 'Fatima Khan',
      gender: 'FEMALE',
      religion: 'ISLAM',
      education: 'BACHELORS',
      profession: 'EDUCATION',
      purposeDomain: 'EDUCATIONAL',
      purposeArchetype: 'ADVOCATE',
      purposeModality: 'COMMUNITY',
      purposeNarrative: 'Empowering students through quality education and mentorship',
      personality: 'EXTROVERT',
      maritalStatus: 'SINGLE',
      lookingFor: 'SINGLE',
      language: 'ENGLISH',
      smoke: 'NO',
      alcohol: 'NO',
            drugs: 'NO',
            politics: ['CENTER'],
      interests: ['READING', 'COOKING', 'TRAVEL'],
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      isNew: false
    }
  },
  {
    email: 'david.rodriguez@pup.com',
    password: 'password123',
    role: 'USER',
    profile: {
      name: 'David Rodriguez',
      gender: 'MALE',
      religion: 'CHRISTIANITY',
      education: 'BACHELORS',
      profession: 'BUSINESS',
      purposeDomain: 'SOCIAL',
      purposeArchetype: 'LEADER',
      purposeModality: 'INDIVIDUAL',
      purposeNarrative: 'Building businesses that create positive social impact',
      personality: 'EXTROVERT',
      maritalStatus: 'SINGLE',
      lookingFor: 'SINGLE',
      language: 'ENGLISH',
      smoke: 'NO',
      alcohol: 'OCCASIONALLY',
      drugs: 'NO',
      politics: ['RIGHT'],
      interests: ['SPORTS', 'TRAVEL', 'MUSIC'],
      city: 'Miami',
      state: 'FL',
      country: 'USA',
      isNew: false
    }
  },
  {
    email: 'priya.patel@pup.com',
    password: 'password123',
        role: 'USER',
        profile: {
      name: 'Priya Patel',
            gender: 'FEMALE',
      religion: 'HINDUISM',
            education: 'MASTERS',
            profession: 'DATA_SCIENCE',
            purposeDomain: 'TECHNOLOGICAL',
      purposeArchetype: 'EXPLORER',
      purposeModality: 'GLOBAL',
      purposeNarrative: 'Using data science to solve complex global challenges',
            personality: 'AMBIVERT',
            maritalStatus: 'SINGLE',
            lookingFor: 'SINGLE',
            language: 'ENGLISH',
            smoke: 'NO',
            alcohol: 'NO',
            drugs: 'NO',
            politics: ['LEFT'],
      interests: ['TECHNOLOGY', 'READING', 'COOKING'],
      city: 'Austin',
      state: 'TX',
      country: 'USA',
      isNew: false
    }
  },
  {
    email: 'james.wilson@pup.com',
    password: 'password123',
        role: 'USER',
        profile: {
      name: 'James Wilson',
            gender: 'MALE',
            religion: 'CHRISTIANITY',
      education: 'BACHELORS',
      profession: 'LAW',
      purposeDomain: 'SOCIAL',
            purposeArchetype: 'ADVOCATE',
      purposeModality: 'COMMUNITY',
      purposeNarrative: 'Advocating for justice and equality through legal practice',
            personality: 'EXTROVERT',
            maritalStatus: 'SINGLE',
            lookingFor: 'SINGLE',
            language: 'ENGLISH',
            smoke: 'NO',
            alcohol: 'OCCASIONALLY',
            drugs: 'NO',
      politics: ['LEFT'],
      interests: ['READING', 'TRAVEL', 'MUSIC'],
      city: 'Boston',
      state: 'MA',
      country: 'USA',
      isNew: false
    }
  },
  {
    email: 'aisha.hassan@pup.com',
    password: 'password123',
    role: 'USER',
    profile: {
      name: 'Aisha Hassan',
      gender: 'FEMALE',
      religion: 'ISLAM',
      education: 'BACHELORS',
      profession: 'DESIGN',
      purposeDomain: 'PERSONAL',
      purposeArchetype: 'CREATOR',
      purposeModality: 'INDIVIDUAL',
      purposeNarrative: 'Creating beautiful and meaningful designs that inspire change',
      personality: 'INTROVERT',
      maritalStatus: 'SINGLE',
      lookingFor: 'SINGLE',
      language: 'ENGLISH',
      smoke: 'NO',
      alcohol: 'NO',
      drugs: 'NO',
      politics: ['CENTER'],
      interests: ['ART', 'MUSIC', 'TRAVEL'],
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      isNew: false
    }
  }
]

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...')

    // Clear existing data
    console.log('🗑️  Clearing existing data...')
    await prisma.match.deleteMany()
    await prisma.profile.deleteMany()
    await prisma.user.deleteMany()

    console.log('👥 Creating users and profiles...')
    
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12)
      
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          passwordHash: hashedPassword,
          role: userData.role,
          isVerified: true,
          isActive: true,
          profile: {
            create: {
              ...userData.profile,
              admiredBy: [],
              admiredUsers: [],
              isActive: true,
              isDeleted: false
            }
          }
        },
        include: {
          profile: true
        }
      })
      
      console.log(`✅ Created user: ${user.email} (${user.profile?.name})`)
    }

    // Create some sample matches
    console.log('💕 Creating sample matches...')
    
    const users = await prisma.user.findMany({
      where: { role: 'USER' },
      include: { profile: true }
    })

    // Create some mutual matches
    const matchPairs = [
      [users[1], users[2]], // Sarah & Michael
      [users[3], users[4]], // Fatima & David
      [users[5], users[6]]  // Priya & James
    ]

    for (const [userA, userB] of matchPairs) {
      if (userA && userB && userA.profile && userB.profile) {
        // Create mutual match
        await prisma.match.createMany({
          data: [
            {
              userAId: userA.id,
              userBId: userB.id,
              initiatedById: userA.id,
              compatibilityScore: 85.0,
              status: 'MATCHED'
            },
            {
              userAId: userB.id,
              userBId: userA.id,
              initiatedById: userB.id,
              compatibilityScore: 85.0,
              status: 'MATCHED'
            }
          ]
        })

        // Update admiration arrays
        await prisma.profile.update({
          where: { id: userA.profile.id },
          data: {
            admiredBy: { push: userB.id },
            admiredUsers: { push: userB.id }
          }
        })

        await prisma.profile.update({
          where: { id: userB.profile.id },
          data: {
            admiredBy: { push: userA.id },
            admiredUsers: { push: userA.id }
          }
        })

        console.log(`💕 Created mutual match: ${userA.profile.name} & ${userB.profile.name}`)
      }
    }

    // Create some pending likes
    const pendingLikes = [
      [users[1], users[5]], // Sarah likes Priya
      [users[2], users[7]], // Michael likes Aisha
      [users[3], users[6]]  // Fatima likes James
    ]

    for (const [liker, liked] of pendingLikes) {
      if (liker && liked && liker.profile && liked.profile) {
        await prisma.match.create({
          data: {
            userAId: liker.id,
            userBId: liked.id,
            initiatedById: liker.id,
            compatibilityScore: 75.0,
            status: 'PENDING'
          }
        })

        // Update admiration arrays
        await prisma.profile.update({
          where: { id: liked.profile.id },
          data: {
            admiredBy: { push: liker.id }
          }
        })

        await prisma.profile.update({
          where: { id: liker.profile.id },
          data: {
            admiredUsers: { push: liked.id }
          }
        })

        console.log(`❤️  Created pending like: ${liker.profile.name} → ${liked.profile.name}`)
      }
    }

    console.log('✅ Database seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`- Created ${sampleUsers.length} users with profiles`)
    console.log('- Created 3 mutual matches')
    console.log('- Created 3 pending likes')
    console.log('\n🔑 Admin credentials:')
    console.log('Email: admin@pup.com')
    console.log('Password: admin123')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seed function
seedDatabase()
  .then(() => {
    console.log('🎉 Seeding completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Seeding failed:', error)
    process.exit(1)
  })
