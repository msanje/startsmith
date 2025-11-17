import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface User {
	name: string;
	age: number;
	active: boolean;
}

const UserSchema = z.object({
	name: z.string(),
	age: z.number(),
	active: z.boolean(),
});

// Form.tsx -> this is how the generated Form is supposed to look like
export function UserForm({ onSubmit }: { onSubmit: (data: User) => void }) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<User>({
		resolver: zodResolver(UserSchema),
		defaultValues: {},
	});

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<h2 style={{ marginBottom: 12 }}>User Form</h2>

			{/* name (string) */}
			<div style={{ marginBottom: 12 }}>
				<label style={{ display: "block", marginBottom: 4 }}>
					name
					<input {...register("name")} />
					{errors.name && <p style={{ color: "red" }}>{errors.name.message}</p>}
				</label>
			</div>

			{/* age (number) */}
			<div style={{ marginBottom: 12 }}>
				<label style={{ display: "block", marginBottom: 4 }}>
					age
					<input type="number" {...register("age", { valueAsNumber: true })} />
					{errors.age && <p style={{ color: "red" }}>{errors.age.message}</p>}
				</label>
			</div>

			{/* active (boolean) */}
			<div style={{ marginBottom: 12 }}>
				<label style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
					<input type="checkbox" {...register("active")} />
					<span>active</span>
				</label>
				{errors.active && (
					<p style={{ color: "red" }}>{errors.active.message}</p>
				)}
			</div>

			<button type="submit">Submit</button>
		</form>
	);
}
