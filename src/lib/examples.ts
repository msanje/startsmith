interface User {
	name: string;
	age: number;
	active: boolean;
}

interface PatientRecord {
	id: string;
	createdAt: string;
	updatedAt: string;

	personal: {
		firstName: string;
		lastName: string;
		age: number;
		gender: "male" | "female" | "other";
		bloodType?: "A" | "B" | "AB" | "O";
	};

	contact: {
		email: string;
		phone?: string;
		address: {
			line1: string;
			line2?: string;
			city: string;
			state?: string;
			zip: string;
			country: string;
		};
	};

	medical: {
		allergies?: string[];
		medications?: {
			name: string;
			dosage: string;
			frequency: string;
		}[];
		conditions?: {
			name: string;
			diagnosedAt: string;
			notes?: string;
		}[];
	};

	insurance?: {
		provider: string;
		policyNumber: string;
		coverage: {
			outpatient: boolean;
			inpatient: boolean;
			dental?: boolean;
			vision?: boolean;
		};
	};

	visits?: {
		date: string;
		doctor: string;
		symptoms: string[];
		diagnosis?: string;
		prescription?: {
			medication: string;
			dosage: string;
		};
		notes?: string;
	}[];
}

interface Subscription {
	customerId: string;
	plan: "free" | "pro" | "team" | "enterprise";
	status: "active" | "inactive" | "past_due" | "cancelled";
	createdAt: string;
	trialEndsAt?: string;

	billing: {
		currency: "USD" | "EUR" | "INR";
		cycle: "monthly" | "yearly";
		paymentMethod: {
			type: "card" | "paypal";
			last4?: string;
			brand?: string;
			paypalEmail?: string;
		};
		invoices?: {
			id: string;
			amount: number;
			paid: boolean;
			issuedAt: string;
		}[];
	};

	usage?: {
		apiCalls: number;
		storageMB: number;
		seats: number;
		integrationsEnabled: string[];
	};

	teamMembers?: {
		id: string;
		email: string;
		role: "admin" | "editor" | "viewer";
		invitedAt?: string;
	}[];
}

interface BlogPost {
	id: string;
	title: string;
	slug: string;
	published: boolean;
	publishedAt?: string;
	author: {
		id: string;
		name: string;
		avatarUrl?: string;
		social?: {
			twitter?: string;
			github?: string;
			website?: string;
		};
	};
	tags: string[];
	content: {
		type: "markdown" | "html" | "block-editor";
		body: string;
	};
	metrics?: {
		views: number;
		likes: number;
		commentsCount: number;
	};
	comments?: {
		id: string;
		user: string;
		message: string;
		createdAt: string;
		replies?: {
			user: string;
			message: string;
			createdAt: string;
		}[];
	}[];
}

interface EcommerceOrder {
	orderId: string;
	createdAt: string;
	status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
	customer: {
		customerId: string;
		name: string;
		email: string;
		phone?: string;
		loyaltyPoints?: number;
		preferences?: {
			newsletter: boolean;
			smsAlerts?: boolean;
			favoriteCategories: string[];
		};
	};
	items: {
		sku: string;
		title: string;
		quantity: number;
		price: number;
		taxRate?: number;
		attributes?: {
			color?: string;
			size?: string;
			metadata?: { [key: string]: string };
		};
	}[];
	shipping: {
		method: "standard" | "express" | "pickup";
		address?: {
			line1: string;
			line2?: string;
			city: string;
			state?: string;
			postalCode: string;
			country: string;
		};
		pickupLocationId?: string;
		estimatedDelivery?: string;
		tracking?: {
			carrier: string;
			trackingNumber?: string;
			history?: { status: string; time: string }[];
		};
	};
	discounts?: {
		code: string;
		amount: number;
		type: "percent" | "fixed";
		appliedTo?: string[]; // SKUs
	}[];
	payment: {
		method: "card" | "paypal" | "bank";
		// detailed shape may vary by method — treat as unknown/union in generator
		details?: unknown;
	};
	metadata?: {
		[key: string]: string;
	};
	notes?: string;
}
