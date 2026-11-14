import { NextRequest, NextResponse } from 'next/server';
import { getInvitacionByToken } from '@/lib/invitaciones';
import { savePushSubscription } from '@/lib/push';
import { pushSubscriptionInputSchema } from '@/lib/validators';
import { locales } from '@/i18n/config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = pushSubscriptionInputSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { subscription, token, lang } = validation.data;
    let invitationId: string | null = null;

    if (token) {
      const invitation = await getInvitacionByToken(token.toUpperCase());
      if (!invitation) {
        return NextResponse.json(
          { success: false, error: 'El código de invitación no es válido' },
          { status: 400 }
        );
      }
      invitationId = invitation.id;
    }

    if (!locales.includes(lang as typeof locales[number])) {
      return NextResponse.json(
        { success: false, error: 'Idioma no válido' },
        { status: 400 }
      );
    }

    await savePushSubscription(subscription, invitationId, lang);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: 'No se pudo guardar la suscripción' },
      { status: 500 }
    );
  }
}
