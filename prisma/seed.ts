import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const main = async() => {
    const subjects: Prisma.SubjectCreateInput[] = [
        {
            id: '1',
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

    await prisma.subject.createMany({ data: subjects })
}

main()
    .catch( e => {
        console.error( "Error: ", e.message );
    })
    .finally( async() => {
        await prisma.$disconnect();
    });