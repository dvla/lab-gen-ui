import { NextResponse } from 'next/server';
import sharp from 'sharp';

export const POST = async (req: Request, res: NextResponse) => {
    try {
        const formData = await req.formData();
        const imageFile = formData.get('file');

        if (imageFile && imageFile instanceof Blob) {
            const buffer = await imageFile.arrayBuffer();
            const resizedBuffer = await sharp(Buffer.from(buffer))
                .resize({
                    width: 800,
                    height: 800,
                    fit: 'inside'
                })
                .toColourspace('rgb8')
                .jpeg({ quality: 70 })
                .toBuffer();
            const base64 = resizedBuffer.toString('base64');
            return NextResponse.json({ message: 'Image processed successfully', base64 }, { status: 200 });
        } else {
            return NextResponse.json({ error: 'Image file not found in the request' }, { status: 400 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error Processing Image' }, { status: 500 });
    }
};