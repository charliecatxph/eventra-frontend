import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectApp } from "@/features/appSlice";
import { fetchAtendees } from "@/functions/getAtendees";
import { X, Mail, Briefcase, Phone, MapPin, User, Clock } from "lucide-react";
import moment from "moment";

// Atendee interface from getAtendees.ts
interface Atendee {
  addr: string;
  attended: boolean;
  email: string;
  evId: string;
  name: string;
  orgN: string;
  orgP: string;
  phoneNumber: string;
  public_id_qr: string;
  registeredOn: number;
  salutations: string;
}

export default function ViewClientRegistration() {
  const router = useRouter();

  return (
    <div className="w-full inter">
      <h1></h1>
    </div>
  );
}
