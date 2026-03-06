/// <reference types="@sveltejs/kit" />

import type { Session } from '@auth/sveltekit';

declare global {
	namespace App {
		interface Locals {
			session: Session | null;
		}
		interface PageData {
			session: Session | null;
		}
	}
}

export {};
