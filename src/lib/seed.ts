import { Role, Gender, Religion, Education, Profession, PurposeDomain, PurposeArchetype, PurposeModality, Interest, Personality, MaritalStatus, LookingFor, Language, Smoke, Alcohol, Drugs, Politics, MatchStatus, PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const prisma = new PrismaClient();

export const sampleUsers = [
  // --- existing admin (kept) ---
  {
    email: 'admin@pup.com',
    password: 'admin123',
    role: Role.ADMIN,
    profile: {
      name: 'Admin User',
      gender: Gender.OTHER,
      religion: Religion.OTHER,
      education: Education.MASTERS,
      profession: Profession.SOFTWARE_DEVELOPMENT,
      purposeDomain: PurposeDomain.TECHNOLOGICAL,
      purposeArchetype: PurposeArchetype.LEADER,
      purposeModality: PurposeModality.GLOBAL,
      purposeNarrative: 'Building technology solutions for social impact',
      personality: Personality.EXTROVERT,
      maritalStatus: MaritalStatus.SINGLE,
      lookingFor: LookingFor.SINGLE,
      language: Language.ENGLISH,
      smoke: Smoke.NO,
      alcohol: Alcohol.OCCASIONALLY,
      drugs: Drugs.NO,
      politics: [Politics.CENTER],
      interests: [Interest.TECHNOLOGY, Interest.READING, Interest.TRAVEL],
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      dob: new Date('1990-01-15'),
      isNew: false,
    },
  },

  // ---------- Pakistan / regional realistic users ----------

  {
    email: 'fatima.zahra@pup.com',
    password: 'password123',
    role: Role.USER,
    profile: {
      name: 'Fatima Zahra',
      gender: Gender.FEMALE,
      religion: Religion.ISLAM,
      education: Education.MASTERS,
      profession: Profession.EDUCATION,
      purposeDomain: PurposeDomain.EDUCATIONAL,
      purposeArchetype: PurposeArchetype.ADVOCATE,
      purposeModality: PurposeModality.COMMUNITY,
      purposeNarrative: 'Improving literacy rates through inclusive classroom design',
      personality: Personality.AMBIVERT,
      maritalStatus: MaritalStatus.SINGLE,
      lookingFor: LookingFor.SINGLE,
      language: Language.URDU,
      smoke: Smoke.NO,
      alcohol: Alcohol.NO,
      drugs: Drugs.NO,
      politics: [Politics.CENTER],
      interests: [Interest.READING, Interest.TRAVEL, Interest.COOKING],
      city: 'Lahore',
      state: 'Punjab',
      country: 'Pakistan',
      dob: new Date('1996-05-22'),
      isNew: false,
    },
  },

  {
    email: 'nimra.shah@pup.com',
    password: 'password123',
    role: Role.USER,
    profile: {
      name: 'Nimra Shah',
      gender: Gender.FEMALE,
      religion: Religion.ISLAM,
      education: Education.BACHELORS,
      profession: Profession.DESIGN,
      purposeDomain: PurposeDomain.PERSONAL,
      purposeArchetype: PurposeArchetype.CREATOR,
      purposeModality: PurposeModality.INDIVIDUAL,
      purposeNarrative: 'Designing accessible digital products that feel human',
      personality: Personality.INTROVERT,
      maritalStatus: MaritalStatus.SINGLE,
      lookingFor: LookingFor.SINGLE,
      language: Language.URDU,
      smoke: Smoke.NO,
      alcohol: Alcohol.NO,
      drugs: Drugs.NO,
      politics: [Politics.LEFT],
      interests: [Interest.ART, Interest.MUSIC, Interest.READING],
      city: 'Karachi',
      state: 'Sindh',
      country: 'Pakistan',
      dob: new Date('1999-11-03'),
      isNew: false,
    },
  },

  {
    email: 'hassan.raza@pup.com',
    password: 'password123',
    role: Role.USER,
    profile: {
      name: 'Hassan Raza',
      gender: Gender.MALE,
      religion: Religion.ISLAM,
      education: Education.BACHELORS,
      profession: Profession.SOFTWARE_DEVELOPMENT,
      purposeDomain: PurposeDomain.TECHNOLOGICAL,
      purposeArchetype: PurposeArchetype.EXPLORER,
      purposeModality: PurposeModality.GLOBAL,
      purposeNarrative: 'Building scalable systems that enable small businesses',
      personality: Personality.AMBIVERT,
      maritalStatus: MaritalStatus.SINGLE,
      lookingFor: LookingFor.SINGLE,
      language: Language.ENGLISH,
      smoke: Smoke.NO,
      alcohol: Alcohol.NO,
      drugs: Drugs.NO,
      politics: [Politics.CENTER],
      interests: [Interest.TECHNOLOGY, Interest.MUSIC, Interest.SPORTS],
      city: 'Islamabad',
      state: 'ICT',
      country: 'Pakistan',
      dob: new Date('1995-08-14'),
      isNew: false,
    },
  },

  {
    email: 'ahmed.karim@pup.com',
    password: 'password123',
    role: Role.USER,
    profile: {
      name: 'Ahmed Karim',
      gender: Gender.MALE,
      religion: Religion.ISLAM,
      education: Education.MASTERS,
      profession: Profession.DATA_SCIENCE,
      purposeDomain: PurposeDomain.TECHNOLOGICAL,
      purposeArchetype: PurposeArchetype.CREATOR,
      purposeModality: PurposeModality.GLOBAL,
      purposeNarrative: 'Using data to optimize urban transport and reduce emissions',
      personality: Personality.INTROVERT,
      maritalStatus: MaritalStatus.SINGLE,
      lookingFor: LookingFor.SINGLE,
      language: Language.ENGLISH,
      smoke: Smoke.NO,
      alcohol: Alcohol.NO,
      drugs: Drugs.NO,
      politics: [Politics.LEFT],
      interests: [Interest.TECHNOLOGY, Interest.READING, Interest.TRAVEL],
      city: 'Lahore',
      state: 'Punjab',
      country: 'Pakistan',
      dob: new Date('1993-03-09'),
      isNew: false,
    },
  },

  {
    email: 'zainab.naeem@pup.com',
    password: 'password123',
    role: Role.USER,
    profile: {
      name: 'Zainab Naeem',
      gender: Gender.FEMALE,
      religion: Religion.ISLAM,
      education: Education.BACHELORS,
      profession: Profession.MEDICINE,
      purposeDomain: PurposeDomain.SOCIAL,
      purposeArchetype: PurposeArchetype.HEALER,
      purposeModality: PurposeModality.COMMUNITY,
      purposeNarrative: 'Expanding preventative healthcare in peri-urban clinics',
      personality: Personality.EXTROVERT,
      maritalStatus: MaritalStatus.SINGLE,
      lookingFor: LookingFor.SINGLE,
      language: Language.URDU,
      smoke: Smoke.NO,
      alcohol: Alcohol.NO,
      drugs: Drugs.NO,
      politics: [Politics.CENTER],
      interests: [Interest.COOKING, Interest.TRAVEL, Interest.READING],
      city: 'Karachi',
      state: 'Sindh',
      country: 'Pakistan',
      dob: new Date('1997-10-27'),
      isNew: false,
    },
  },

  {
    email: 'bilal.hameed@pup.com',
    password: 'password123',
    role: Role.USER,
    profile: {
      name: 'Bilal Hameed',
      gender: Gender.MALE,
      religion: Religion.ISLAM,
      education: Education.BACHELORS,
      profession: Profession.ENGINEERING,
      purposeDomain: PurposeDomain.ENVIRONMENTAL,
      purposeArchetype: PurposeArchetype.CREATOR,
      purposeModality: PurposeModality.GLOBAL,
      purposeNarrative: 'Designing low-cost solar microgrids for rural areas',
      personality: Personality.AMBIVERT,
      maritalStatus: MaritalStatus.SINGLE,
      lookingFor: LookingFor.SINGLE,
      language: Language.URDU,
      smoke: Smoke.NO,
      alcohol: Alcohol.OCCASIONALLY,
      drugs: Drugs.NO,
      politics: [Politics.LEFT],
      interests: [Interest.TECHNOLOGY, Interest.SPORTS, Interest.TRAVEL],
      city: 'Faisalabad',
      state: 'Punjab',
      country: 'Pakistan',
      dob: new Date('1994-06-18'),
      isNew: false,
    },
  },

  {
    email: 'maryam.saeed@pup.com',
    password: 'password123',
    role: Role.USER,
    profile: {
      name: 'Maryam Saeed',
      gender: Gender.FEMALE,
      religion: Religion.ISLAM,
      education: Education.MASTERS,
      profession: Profession.BUSINESS,
      purposeDomain: PurposeDomain.SOCIAL,
      purposeArchetype: PurposeArchetype.LEADER,
      purposeModality: PurposeModality.COMMUNITY,
      purposeNarrative: 'Building women-led SMEs with fair-work standards',
      personality: Personality.EXTROVERT,
      maritalStatus: MaritalStatus.SINGLE,
      lookingFor: LookingFor.SINGLE,
      language: Language.ENGLISH,
      smoke: Smoke.NO,
      alcohol: Alcohol.NO,
      drugs: Drugs.NO,
      politics: [Politics.RIGHT],
      interests: [Interest.TRAVEL, Interest.MUSIC, Interest.READING],
      city: 'Karachi',
      state: 'Sindh',
      country: 'Pakistan',
      dob: new Date('1992-12-01'),
      isNew: false,
    },
  },

  {
    email: 'usman.tariq@pup.com',
    password: 'password123',
    role: Role.USER,
    profile: {
      name: 'Usman Tariq',
      gender: Gender.MALE,
      religion: Religion.ISLAM,
      education: Education.BACHELORS,
      profession: Profession.LAW,
      purposeDomain: PurposeDomain.SOCIAL,
      purposeArchetype: PurposeArchetype.ADVOCATE,
      purposeModality: PurposeModality.COMMUNITY,
      purposeNarrative: 'Providing pro-bono legal aid for labor disputes',
      personality: Personality.INTROVERT,
      maritalStatus: MaritalStatus.SINGLE,
      lookingFor: LookingFor.SINGLE,
      language: Language.URDU,
      smoke: Smoke.NO,
      alcohol: Alcohol.NO,
      drugs: Drugs.NO,
      politics: [Politics.LEFT],
      interests: [Interest.READING, Interest.MUSIC, Interest.TRAVEL],
      city: 'Rawalpindi',
      state: 'Punjab',
      country: 'Pakistan',
      dob: new Date('1991-09-05'),
      isNew: false,
    },
  },

  {
    email: 'hina.iqbal@pup.com',
    password: 'password123',
    role: Role.USER,
    profile: {
      name: 'Hina Iqbal',
      gender: Gender.FEMALE,
      religion: Religion.ISLAM,
      education: Education.BACHELORS,
      profession: Profession.DESIGN,
      purposeDomain: PurposeDomain.PERSONAL,
      purposeArchetype: PurposeArchetype.CREATOR,
      purposeModality: PurposeModality.INDIVIDUAL,
      purposeNarrative: 'Crafting culturally rooted visual identities for startups',
      personality: Personality.AMBIVERT,
      maritalStatus: MaritalStatus.SINGLE,
      lookingFor: LookingFor.SINGLE,
      language: Language.ENGLISH,
      smoke: Smoke.NO,
      alcohol: Alcohol.NO,
      drugs: Drugs.NO,
      politics: [Politics.CENTER],
      interests: [Interest.ART, Interest.READING, Interest.TRAVEL],
      city: 'Hyderabad',
      state: 'Sindh',
      country: 'Pakistan',
      dob: new Date('1998-02-19'),
      isNew: false,
    },
  },

  {
    email: 'haris.nawaz@pup.com',
    password: 'password123',
    role: Role.USER,
    profile: {
      name: 'Haris Nawaz',
      gender: Gender.MALE,
      religion: Religion.ISLAM,
      education: Education.MASTERS,
      profession: Profession.BUSINESS,
      purposeDomain: PurposeDomain.SOCIAL,
      purposeArchetype: PurposeArchetype.LEADER,
      purposeModality: PurposeModality.INDIVIDUAL,
      purposeNarrative: 'Scaling ethical supply chains across local artisans',
      personality: Personality.EXTROVERT,
      maritalStatus: MaritalStatus.SINGLE,
      lookingFor: LookingFor.SINGLE,
      language: Language.ENGLISH,
      smoke: Smoke.NO,
      alcohol: Alcohol.OCCASIONALLY,
      drugs: Drugs.NO,
      politics: [Politics.CENTER],
      interests: [Interest.SPORTS, Interest.TRAVEL, Interest.MUSIC],
      city: 'Multan',
      state: 'Punjab',
      country: 'Pakistan',
      dob: new Date('1990-07-30'),
      isNew: false,
    },
  },

  // you can keep your original US-based examples below if you want extra diversity
  {
    email: 'aisha.hassan@pup.com',
    password: 'password123',
    role: Role.USER,
    profile: {
      name: 'Aisha Hassan',
      gender: Gender.FEMALE,
      religion: Religion.ISLAM,
      education: Education.BACHELORS,
      profession: Profession.DESIGN,
      purposeDomain: PurposeDomain.PERSONAL,
      purposeArchetype: PurposeArchetype.CREATOR,
      purposeModality: PurposeModality.INDIVIDUAL,
      purposeNarrative: 'Creating beautiful and meaningful designs that inspire change',
      personality: Personality.INTROVERT,
      maritalStatus: MaritalStatus.SINGLE,
      lookingFor: LookingFor.SINGLE,
      language: Language.ENGLISH,
      smoke: Smoke.NO,
      alcohol: Alcohol.NO,
      drugs: Drugs.NO,
      politics: [Politics.CENTER],
      interests: [Interest.ART, Interest.MUSIC, Interest.TRAVEL],
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      dob: new Date('1998-09-17'),
      isNew: false,
    },
  },
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await prisma.match.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();

    console.log('👥 Creating users and profiles...');

    // Assume `sampleUsers` is imported or defined above
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);

      const user = await prisma.user.create({
        data: {
          email: userData.email,
          passwordHash: hashedPassword,
          role: userData.role as Role,
          isVerified: true,
          isActive: true,
          profile: {
            create: {
              ...userData.profile,
              admiredBy: [],
              admiredUsers: [],
              isActive: true,
              isDeleted: false,
            },
          },
        },
        include: { profile: true },
      });

      console.log(`✅ Created user: ${user.email} (${user.profile?.name})`);
    }

    // Fetch users with profiles for matching
    const users = await prisma.user.findMany({
      where: { role: 'USER' },
      include: { profile: true },
    });

    // Define mutual match pairs by email
    const matchPairs = [
      ['fatima.zahra@pup.com', 'hassan.raza@pup.com'],
      ['nimra.shah@pup.com', 'ahmed.karim@pup.com'],
      ['zainab.naeem@pup.com', 'bilal.hameed@pup.com'],
    ];

    for (const [emailA, emailB] of matchPairs) {
      try {
        const userA = users.find(u => u.email === emailA);
        const userB = users.find(u => u.email === emailB);
        if (!userA || !userB || !userA.profile || !userB.profile) continue;

        // Create mutual matches
        await prisma.match.createMany({
          data: [
            {
              userAId: userA.id,
              userBId: userB.id,
              initiatedById: userA.id,
              compatibilityScore: 85.0,
              status: MatchStatus.MATCHED,
            },
            {
              userAId: userB.id,
              userBId: userA.id,
              initiatedById: userB.id,
              compatibilityScore: 85.0,
              status: MatchStatus.MATCHED,
            },
          ],
        });

        // Update admiration safely
        await prisma.profile.update({
          where: { id: userA.profile.id },
          data: {
            admiredBy: { set: [...userA.profile.admiredBy, userB.id] },
            admiredUsers: { set: [...userA.profile.admiredUsers, userB.id] },
          },
        });

        await prisma.profile.update({
          where: { id: userB.profile.id },
          data: {
            admiredBy: { set: [...userB.profile.admiredBy, userA.id] },
            admiredUsers: { set: [...userB.profile.admiredUsers, userA.id] },
          },
        });

        console.log(`💕 Created mutual match: ${userA.profile.name} & ${userB.profile.name}`);
      } catch (err) {
        console.error('⚠️ Error creating mutual match:', err);
      }
    }

    // Define pending likes (one-sided)
    const pendingLikes = [
      ['maryam.saeed@pup.com', 'usman.tariq@pup.com'],
      ['hina.iqbal@pup.com', 'haris.nawaz@pup.com'],
      ['aisha.hassan@pup.com', 'fatima.zahra@pup.com'],
    ];

    for (const [likerEmail, likedEmail] of pendingLikes) {
      try {
        const liker = users.find(u => u.email === likerEmail);
        const liked = users.find(u => u.email === likedEmail);
        if (!liker || !liked || !liker.profile || !liked.profile) continue;

        await prisma.match.create({
          data: {
            userAId: liker.id,
            userBId: liked.id,
            initiatedById: liker.id,
            compatibilityScore: 75.0,
            status: MatchStatus.PENDING,
          },
        });

        await prisma.profile.update({
          where: { id: liked.profile.id },
          data: { admiredBy: { set: [...liked.profile.admiredBy, liker.id] } },
        });

        await prisma.profile.update({
          where: { id: liker.profile.id },
          data: {
            admiredUsers: { set: [...liker.profile.admiredUsers, liked.id] },
          },
        });

        console.log(`❤️  Created pending like: ${liker.profile.name} → ${liked.profile.name}`);
      } catch (err) {
        console.error('⚠️ Error creating pending like:', err);
      }
    }

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Created ${sampleUsers.length} users with profiles`);
    console.log('- Created 3 mutual matches');
    console.log('- Created 3 pending likes');
    console.log('\n🔑 Admin credentials:');
    console.log('Email: admin@pup.com');
    console.log('Password: admin123');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase()
  .then(() => {
    console.log('🎉 Seeding completed!');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  });
