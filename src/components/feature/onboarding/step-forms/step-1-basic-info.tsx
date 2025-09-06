"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Profile } from "@/types/types"
import { AlertCircle } from "lucide-react"

interface Step1BasicInfoProps {
  formData: Partial<Profile>
  errors: Record<string, string>
  onInputChange: (fieldName: string, value: string | number | string[]) => void
}

export function Step1BasicInfo({ formData, errors, onInputChange }: Step1BasicInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your full name"
          value={formData.name || ""}
          onChange={(e) => onInputChange("name", e.target.value)}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && (
          <div className="flex items-center space-x-2 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            <span>{errors.name}</span>
          </div>
        )}
      </div>

      {/* Date of Birth */}
      <div className="space-y-2">
        <Label htmlFor="dob">Date of Birth</Label>
        <Input
          id="dob"
          type="date"
          value={formData.dob ? (formData.dob instanceof Date ? formData.dob.toISOString().split('T')[0] : formData.dob) : ""}
          onChange={(e) => onInputChange("dob", e.target.value)}
          className={errors.dob ? "border-red-500" : ""}
        />
        {errors.dob && (
          <div className="flex items-center space-x-2 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            <span>{errors.dob}</span>
          </div>
        )}
      </div>

      {/* Gender */}
      <div className="space-y-2">
        <Label htmlFor="gender">Gender</Label>
        <Select value={formData.gender || ""} onValueChange={(value) => onInputChange("gender", value)}>
          <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MALE">Male</SelectItem>
            <SelectItem value="FEMALE">Female</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.gender && (
          <div className="flex items-center space-x-2 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            <span>{errors.gender}</span>
          </div>
        )}
      </div>

      {/* Income */}
      <div className="space-y-2">
        <Label htmlFor="income">Monthly Income</Label>
        <Input
          id="income"
          type="number"
          placeholder="Enter your monthly income"
          value={formData.income || ""}
          onChange={(e) => onInputChange("income", e.target.value)}
          className={errors.income ? "border-red-500" : ""}
        />
        {errors.income && (
          <div className="flex items-center space-x-2 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            <span>{errors.income}</span>
          </div>
        )}
      </div>

      {/* Religion */}
      <div className="space-y-2">
        <Label htmlFor="religion">Religion</Label>
        <Select value={formData.religion || ""} onValueChange={(value) => onInputChange("religion", value)}>
          <SelectTrigger className={errors.religion ? "border-red-500" : ""}>
            <SelectValue placeholder="Select religion" />
          </SelectTrigger>
          <SelectContent className="max-h-[200px] overflow-y-auto">
            <SelectItem value="ISLAM">Islam</SelectItem>
            <SelectItem value="CHRISTIANITY">Christianity</SelectItem>
            <SelectItem value="HINDUISM">Hinduism</SelectItem>
            <SelectItem value="BUDDHISM">Buddhism</SelectItem>
            <SelectItem value="JUDAISM">Judaism</SelectItem>
            <SelectItem value="ATHEISM">Atheism</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.religion && (
          <div className="flex items-center space-x-2 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            <span>{errors.religion}</span>
          </div>
        )}
      </div>

      {/* Education */}
      <div className="space-y-2">
        <Label htmlFor="education">Education Level</Label>
        <Select value={formData.education || ""} onValueChange={(value) => onInputChange("education", value)}>
          <SelectTrigger className={errors.education ? "border-red-500" : ""}>
            <SelectValue placeholder="Select education level" />
          </SelectTrigger>
          <SelectContent className="max-h-[200px] overflow-y-auto">
            <SelectItem value="NONE">None</SelectItem>
            <SelectItem value="PRIMARY">Primary</SelectItem>
            <SelectItem value="SECONDARY">Secondary</SelectItem>
            <SelectItem value="HIGH_SCHOOL">High School</SelectItem>
            <SelectItem value="BACHELORS">Bachelor&apos;s Degree</SelectItem>
            <SelectItem value="MASTERS">Master&apos;s Degree</SelectItem>
            <SelectItem value="PHD">PhD</SelectItem>
            <SelectItem value="SELF_TAUGHT">Self Taught</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.education && (
          <div className="flex items-center space-x-2 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            <span>{errors.education}</span>
          </div>
        )}
      </div>

      {/* Profession */}
      <div className="space-y-2">
        <Label htmlFor="profession">Profession</Label>
        <Select value={formData.profession || ""} onValueChange={(value) => onInputChange("profession", value)}>
          <SelectTrigger className={errors.profession ? "border-red-500" : ""}>
            <SelectValue placeholder="Select profession" />
          </SelectTrigger>
          <SelectContent className="max-h-[200px] overflow-y-auto">
            <SelectItem value="STUDENT">Student</SelectItem>
            <SelectItem value="ENGINEERING">Engineering</SelectItem>
            <SelectItem value="SOFTWARE_DEVELOPMENT">Software Development</SelectItem>
            <SelectItem value="DATA_SCIENCE">Data Science</SelectItem>
            <SelectItem value="ARTIFICIAL_INTELLIGENCE">Artificial Intelligence</SelectItem>
            <SelectItem value="MEDICINE">Medicine</SelectItem>
            <SelectItem value="DENTISTRY">Dentistry</SelectItem>
            <SelectItem value="NURSING">Nursing</SelectItem>
            <SelectItem value="EDUCATION">Education</SelectItem>
            <SelectItem value="BUSINESS">Business</SelectItem>
            <SelectItem value="ENTREPRENEUR">Entrepreneur</SelectItem>
            <SelectItem value="FINANCE">Finance</SelectItem>
            <SelectItem value="MARKETING">Marketing</SelectItem>
            <SelectItem value="SALES">Sales</SelectItem>
            <SelectItem value="LAW">Law</SelectItem>
            <SelectItem value="GOVERNMENT">Government</SelectItem>
            <SelectItem value="PUBLIC_SERVICE">Public Service</SelectItem>
            <SelectItem value="DESIGN">Design</SelectItem>
            <SelectItem value="WRITING">Writing</SelectItem>
            <SelectItem value="JOURNALISM">Journalism</SelectItem>
            <SelectItem value="ARTS">Arts</SelectItem>
            <SelectItem value="FILM">Film</SelectItem>
            <SelectItem value="MUSIC">Music</SelectItem>
            <SelectItem value="SPORTS">Sports</SelectItem>
            <SelectItem value="AGRICULTURE">Agriculture</SelectItem>
            <SelectItem value="ARCHITECTURE">Architecture</SelectItem>
            <SelectItem value="PSYCHOLOGY">Psychology</SelectItem>
            <SelectItem value="SOCIAL_WORK">Social Work</SelectItem>
            <SelectItem value="FREELANCER">Freelancer</SelectItem>
            <SelectItem value="UNEMPLOYED">Unemployed</SelectItem>
            <SelectItem value="HOMEMAKER">Homemaker</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.profession && (
          <div className="flex items-center space-x-2 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            <span>{errors.profession}</span>
          </div>
        )}
      </div>
    </div>
  )
}
