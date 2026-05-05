import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().trim().min(2, "O nome é obrigatório"),
  address: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  status: z.enum(["ativo", "inativo"]).default("ativo"),
  timeZone: z.string().min(1, { message: "O time zone é obrigatório" }),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export function useProfileForm() {
  return useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema) as any,
    mode: "onChange",
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      status: "ativo",
      timeZone: "",
    },
  });
}
