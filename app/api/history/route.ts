import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/mongodb';

// GET - Fetch user's history
export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { db } = await connectToDatabase();

        const conversations = await db
            .collection('conversations')
            .find({ userId })
            .sort({ updatedAt: -1 })
            .limit(50)
            .toArray();

        const analyses = await db
            .collection('analyses')
            .find({ userId })
            .sort({ createdAt: -1 })
            .limit(50)
            .toArray();

        return NextResponse.json({
            success: true,
            conversations,
            analyses,
        });
    } catch (err: any) {
        console.error('History fetch error:', err);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch history: ' + err.message },
            { status: 500 }
        );
    }
}

// POST - Save a conversation or analysis
export async function POST(req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { type, data } = body;

        const { db } = await connectToDatabase();

        if (type === 'conversation') {
            // Upsert conversation (update if same conversationId, otherwise create)
            const { conversationId, messages, title } = data;

            if (conversationId) {
                await db.collection('conversations').updateOne(
                    { conversationId, userId },
                    {
                        $set: {
                            messages,
                            title: title || messages[0]?.content?.slice(0, 60) || 'Untitled Chat',
                            updatedAt: new Date(),
                        },
                        $setOnInsert: {
                            userId,
                            conversationId,
                            createdAt: new Date(),
                        },
                    },
                    { upsert: true }
                );
            }

            return NextResponse.json({ success: true });
        }

        if (type === 'analysis') {
            await db.collection('analyses').insertOne({
                userId,
                ...data, // includes formData, recommendations, ragUsed, and any other result data
                createdAt: new Date(),
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    } catch (err: any) {
        console.error('History save error:', err);
        return NextResponse.json(
            { success: false, error: 'Failed to save history: ' + err.message },
            { status: 500 }
        );
    }
}

// DELETE - Delete a history item
export async function DELETE(req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const type = searchParams.get('type');

        if (!id || !type) {
            return NextResponse.json({ error: 'Missing id or type' }, { status: 400 });
        }

        const { db } = await connectToDatabase();
        const { ObjectId } = await import('mongodb');

        const collection = type === 'conversation' ? 'conversations' : 'analyses';
        await db.collection(collection).deleteOne({
            _id: new ObjectId(id),
            userId,
        });

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('History delete error:', err);
        return NextResponse.json(
            { success: false, error: 'Failed to delete: ' + err.message },
            { status: 500 }
        );
    }
}
