'use server';

import { PrismaClient } from "@prisma/client";
import { timeStamp } from "console";
import {  writeFileSync } from "fs";
import { writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import path, { join } from "path";

const prisma = new PrismaClient();

export async function getTipeKamar() {
  try{
    const data = await prisma.tipe_kamar.findMany();

  await prisma.$disconnect()
  return data;
  } catch (err) {
    console.log('this is error :' +err )
    await prisma.$disconnect
    process.exit(1)
  }
}

export async function addTipeKamar(formData: FormData) {
  try {

    const nama_tipe_kamar = formData.get("nama_tipe_kamar");
    const harga = Number(formData.get("harga"));
    const deskripsi = formData.get("deskripsi");
    const file = formData.get("foto");


    let filename = undefined
    if (file) {
        const bytes = await file.arrayBuffer(); //success baecause type is file
        const buffer = Buffer.from(bytes);
    
        const foto = join(`image-${Date.now()}${path.extname(file.name)}`); //success beacause type is file
        writeFile(`./public/upload/tipe_kamar/${foto}`, buffer)
        console.log("The file has been saved!");

        filename = foto
      }
      

    const data = await prisma.tipe_kamar.create({
      data: {
        nama_tipe_kamar,
        harga,
        deskripsi,
        foto : filename
      },
    });

    revalidatePath('/','page')
    await prisma.$disconnect();
    return data;

  } catch (err) {
   console.log('this is error '+err)
   await prisma.$disconnect();
  }
}

export async function editTipeKamar(formData: FormData) {
  try {
    const id_tipe_kamar = Number(formData.get('id_tipe_kamar'))
    const nama_tipe_kamar = formData.get("nama_tipe_kamar") || undefined 
    const harga =  formData.get("harga")? Number(formData.get("harga")): undefined
    const foto = formData.get("foto") || undefined
    const deskripsi = formData.get("deskripsi") || undefined

    let filename = undefined

    console.log(foto)

    if (foto) {
      const buffer = await foto.arrayBuffer();
      const view = new Uint8Array(buffer)

      const name = `image-${Date.now()}${path.extname(foto?.name)}`;


      try{
         await writeFile(`./public/upload/tipe_kamar/${name}`, view);
        console.log('file has been saved! in ./public/upload/tipe_kamar/ '+ name)
      } catch (err) {
        console.log('this is error upload file :' + err)
      }
      filename = name
    }

     const data = await prisma.tipe_kamar.update({
        where: { id_tipe_kamar: id_tipe_kamar },
        data: {
          nama_tipe_kamar : nama_tipe_kamar,
          foto: filename, 
          harga : harga,
          deskripsi : deskripsi

        },
      })


      revalidatePath('/', 'layout')
      await prisma.$disconnect()
      return data;

  } catch (err) {
    console.log('this is error ' +err)
    await prisma.$disconnect();
  }
}

export async function deleteTipeKamar(id_tipe_kamar: number) {
  try{
    const data = await prisma.tipe_kamar.delete({
      where: {id_tipe_kamar : id_tipe_kamar}
    })

    revalidatePath('/','layout')
    await prisma.$disconnect();
    return data;
  } catch (err) {
    console.log('there is error '+err)

  }
}

export async function getTipeKamarId(id: number) {
  try {
    
    const data = await prisma.tipe_kamar.findUnique({
        where: { id_tipe_kamar: id },
      })
     revalidatePath('/' , 'layout');
    await prisma.$disconnect();
    return data;
  } catch (err) {
    console.log('this is error: '+err)
    await prisma.$disconnect();
  }
}
