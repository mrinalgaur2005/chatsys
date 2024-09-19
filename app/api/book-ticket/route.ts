import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function POST(req: Request) {
    try {
        const { name, destination, date, numberOfTickets, userId} = await req.json();

        //added-by add krna

        if (!name || !destination || !date || !numberOfTickets || !userId) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const ticket = await db.tickets.findFirst({
            where: {
                name: destination,
            },
        });

        if (!ticket || ticket.ticketAvailable < numberOfTickets) {
            return NextResponse.json({ error: 'Not enough tickets available' }, { status: 400 });
        }

        await db.tickets.update({
            where: {
                id: ticket.id,
            },
            data: {
                ticketAvailable: {
                    decrement: numberOfTickets,
                },
            },
        });

        const newTicketPurchase = await db.tickets.create({
          data: {
            name: destination,
            amount: numberOfTickets,
            ticketAvailable: ticket.ticketAvailable - numberOfTickets,
            purchasedBy: {
              connect: {
                id: userId,
              },
            },
          },
        });
        

        return NextResponse.json({ message: 'Ticket booked successfully', ticket: newTicketPurchase }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
