import { PrismaClient, Prisma } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

const main = async() => {
    const subjects = [
        {
            id: '1175838456270823434',
            name: 'ภาษาไทย'
        },
        {
            id: '2',
            name: 'คณิตพื้น'
        },
        {
            id: '3',
            name: 'พละ'
        },
        {
            id: '4',
            name: 'นาฏศิลป์'
        },
        {
            id: '5',
            name: 'ภาษาอังกฤษพื้น'
        },
        {
            id: '6',
            name: 'คณิตเพิ่ม'
        },
        {
            id: '7',
            name: 'ฟิสิกส์เพิ่ม'
        },
        {
            id: '8',
            name: 'เคมีเพิ่ม'
        },
        {
            id: '9',
            name: 'ชีวะ'
        },
        {
            id: '10',
            name: 'เขียนแบบ'
        },
        {
            id: '11',
            name: 'ภาษาอังกฤษรอบรู้'
        },
        {
            id: '12',
            name: 'ภาษาจีน'
        },
    ]

    const subjectsData: Prisma.SubjectCreateManyInput[] = subjects.map( subject => {
        return {
            id: subject.id,
            name: subject.name,
            guildId: process.env.GUILD_ID as string
        }
    })

    await prisma.subject.createMany({ data: subjectsData })
}

main()
    .catch( e => {
        console.error( "Error: ", e.message );
    })
    .finally( async() => {
        await prisma.$disconnect();
    });