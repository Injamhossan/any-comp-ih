import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/data-source";
import { User } from "@/entities/User";
import { UserRole } from "@/entities/Enums";
import { ServiceOfferingMasterList } from "@/entities/ServiceOfferingMasterList";
import { PlatformFee } from "@/entities/PlatformFee";
import { TierName } from "@/entities/Enums";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const dataSource = await getDataSource();
    console.log("Connected to database for seeding...");

    const results = [];

    // 1. Seed Admin User
    const userRepo = dataSource.getRepository(User);
    const adminEmail = "admin@anycomp.com";
    const existingAdmin = await userRepo.findOneBy({ email: adminEmail });

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash("admin123", 10);
        const admin = new User();
        admin.name = "System Admin";
        admin.email = adminEmail;
        admin.password = hashedPassword;
        admin.role = UserRole.ADMIN;
        await userRepo.save(admin);
        results.push("✅ Admin user created: admin@anycomp.com / admin123");
    } else {
        results.push("ℹ️ Admin user already exists");
    }

    // 2. Seed Master Offerings
    const masterRepo = dataSource.getRepository(ServiceOfferingMasterList);
    // Be careful with TRUNCATE in an API, maybe just skip if exists?
    // For safety in this context, we will count first.
    const offeringCount = await masterRepo.count();

    if (offeringCount === 0) {
        const offeringsData = [
            { title: "Company Secretary Subscription", description: "Enjoy 1 month free Company Secretary Subscription", s3_key: "user-check", bucket_name: "anycomp-assets" },
            { title: "Opening of a Bank Account", description: "Complimentary Corporate Bank Account Opening", s3_key: "landmark", bucket_name: "anycomp-assets" },
            { title: "Access Company Records and SSM Forms", description: "24/7 Secure Access to Statutory Company Records", s3_key: "files", bucket_name: "anycomp-assets" },
            { title: "Priority Filling", description: "Documents are prioritized for submission and swift processing - within 24 hours", s3_key: "zap", bucket_name: "anycomp-assets" },
            { title: "Registered Office Address Use", description: "Use of SSM-Compliant Registered Office Address with Optional Mail Forwarding", s3_key: "map-pin", bucket_name: "anycomp-assets" },
            { title: "Compliance Calendar Setup", description: "Get automated reminders for all statutory deadlines", s3_key: "calendar-check", bucket_name: "anycomp-assets" },
            { title: "First Share Certificate Issued Free", description: "Receive your company's first official share certificate at no cost", s3_key: "award", bucket_name: "anycomp-assets" },
            { title: "CTC Delivery & Courier Handling", description: "Have your company documents and certified copies delivered securely to you", s3_key: "truck", bucket_name: "anycomp-assets" },
            { title: "Chat Support", description: "Always-On Chat Support for Compliance, Filing, and General Queries", s3_key: "headphones", bucket_name: "anycomp-assets" }
        ];

        for (const item of offeringsData) {
            const offering = masterRepo.create(item);
            await masterRepo.save(offering);
        }
        results.push(`✅ Seeded ${offeringsData.length} Master Offerings`);
    } else {
        results.push("ℹ️ Master Offerings already exist");
    }

    // 3. Seed Platform Fees
    const feeRepo = dataSource.getRepository(PlatformFee);
    const existingFees = await feeRepo.count();

    if (existingFees === 0) {
        const feesData = [
            { tier_name: TierName.BASIC, min_value: 0, max_value: 1000, platform_fee_percentage: 15.00 },
            { tier_name: TierName.PREMIUM, min_value: 1001, max_value: 5000, platform_fee_percentage: 10.00 },
            { tier_name: TierName.ENTERPRISE, min_value: 5001, max_value: 999999, platform_fee_percentage: 5.00 }
        ];

        for (const item of feesData) {
            const fee = feeRepo.create(item);
            await feeRepo.save(fee);
        }
        results.push(`✅ Seeded ${feesData.length} Platform Fee tiers`);
    } else {
        results.push("ℹ️ Platform Fees already exist");
    }

    // 4. Seed Sample Specialist (for initial display)
    const { Specialist } = await import("@/entities/Specialist");
    const { VerificationStatus } = await import("@/entities/Enums");
    const specialistRepo = dataSource.getRepository(Specialist);
    const existingSpecialists = await specialistRepo.count();

    if (existingSpecialists === 0) {
        const sample = new Specialist();
        sample.title = "Complete SDN BHD Registration";
        sample.description = "Professional Sdn Bhd incorporation service. Includes name search, SSM registration, and digital copies of all documents.";
        sample.base_price = 1500;
        sample.final_price = 1950; // 30% markup approx
        sample.duration_days = 5;
        sample.secretary_name = "Ahmad Zaki";
        sample.secretary_company = "AZ Corporate Services";
        sample.secretary_email = "zaki@azservices.com";
        sample.secretary_phone = "012-3456789";
        // sample.secretary_license_no = "LS0012345"; // Not in entity
        sample.verification_status = VerificationStatus.VERIFIED;
        sample.is_draft = false;
        sample.slug = "complete-sdn-bhd-registration";
        
        await specialistRepo.save(sample);
        results.push("✅ Seeded Sample Specialist Service");
    } else {
        results.push("ℹ️ Specialist Services already exist");
    }

    return NextResponse.json({ success: true, messages: results });
  } catch (error: any) {
    console.error("Seed Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
