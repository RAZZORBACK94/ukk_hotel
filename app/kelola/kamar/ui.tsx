'use client';

import { IKamar, ITipekamar } from '@/app/component/type/type';
import React, { useEffect, useState } from 'react'
import { FaPlus, FaTrash } from 'react-icons/fa6';
import { FaPenAlt } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import { addKamar, deleteKamar, editKamar } from '@/app/api/kamar/kamar';
import Image from 'next/image';
import { addTipeKamar, deleteTipeKamar, editTipeKamar } from '@/app/api/kamar/tipe_kamar/tipe_kamar';
import { toast, Toaster } from 'sonner';

interface kamarProps {
    kamar: IKamar[] | undefined,
    tipekamar: ITipekamar[] | undefined,
    session: any
}

export default function Ui({ kamar, tipekamar, session }: kamarProps) {



    const [open, setOpen] = useState(false)
    const [tabel, settabel] = useState('kamar')


    const [id_kamar, setId_kamar] = useState('')
    const [nomor_kamar, setNomorKamar] = useState('')

    const [id_tipe_kamar, setId_tipe_kamar] = useState('')
    const [nama_tipe_kamar, setNama_tipe_kamar] = useState('')
    const [deskripsi, setDeskripsi] = useState('')
    const [foto, setFoto] = useState<File>();
    const [harga, setHarga] = useState('')

    const [submit, setSubmit] = useState('add')


    function handleEdit({ id_kamar, nomor_kamar, id_tipe_kamar, nama_tipe_kamar, deskripsi, harga }: any) {
        if (tabel === 'kamar') {
            setId_kamar(id_kamar)
            setNomorKamar(nomor_kamar)
            setId_tipe_kamar(id_tipe_kamar)

        } else if (tabel === 'tipe_kamar') {
            setId_tipe_kamar(id_tipe_kamar)
            setNama_tipe_kamar(nama_tipe_kamar)
            setDeskripsi(deskripsi)
            setHarga(harga)
        }

        setSubmit('edit')
    }

    function handleAdd() {
        if (tabel === 'kamar') {
            setId_kamar('')
            setNomorKamar('')
            setId_tipe_kamar('')
        } else if (tabel === 'tipe_kamar') {
            setId_tipe_kamar('')
            setNama_tipe_kamar('')
            setDeskripsi('')
            setHarga('')
        }

        setSubmit('add')
    }


    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const formData = new FormData();

        if (tabel == 'kamar') {
            if(id_kamar){
                formData.append('id_kamar', id_kamar)
            }
            if(nomor_kamar){
                formData.append('nomor_kamar', nomor_kamar)
            }
            if(id_tipe_kamar){
                formData.append('id_tipe_kamar', id_tipe_kamar)
            }

            if (submit === 'add') {
                const data = await addKamar(formData)
                if (data.error) {
                    toast.error(data.error)
                } else{
                    toast.success(data.message)
                }
            } else if (submit == 'edit') {
                const data= await editKamar(formData)
                if (data.error) {
                    toast.error(data.error)
                } else{
                    toast.success(data.message)
                }
            }

        } else if(tabel == 'tipe_kamar') {
            if (id_tipe_kamar) {
                formData.append('id_tipe_kamar', id_tipe_kamar)      
            }
            if (nama_tipe_kamar) {
                formData.append('nama_tipe_kamar', nama_tipe_kamar)
            }
            if (deskripsi) {
                formData.append('deskripsi', deskripsi)      
            }
            if (harga) {
                formData.append('harga', harga)      
            }
            if (foto) {
                formData.append('foto', foto)      
            }

            if (submit === 'add') {
                const data = await addTipeKamar(formData)
                if (data.error) {
                    toast.error(data.error)
                } else{
                    toast.success(data.message)
                }
            } else if (submit == 'edit') {
                const data= await editTipeKamar(formData)
                if (data.error) {
                    toast.error(data.error)
                } else{
                    toast.success(data.message)
                }
            }
        } // Call the function with form data
    };

    const namaTipeKamar = (target: string) => {
        const data = tipekamar?.find(item => item.id_tipe_kamar == target)
        return data?.nama_tipe_kamar
    }

    function gantiTable() {
        if (tabel === 'kamar') {
            settabel('tipe_kamar')
        } else {
            settabel('kamar')
        }
    }

    const warnaTipeKamar= (id: string) => {
        if (id === tipekamar![0].id_tipe_kamar) {
            return "bg-blue-500"
        } else if (id === tipekamar![1].id_tipe_kamar) {
            return "bg-orange-500"
        }
    }


    return (
        <div>
            <Toaster richColors/>
            <div className='pt-28 p-10 flex flex-col space-y-5'>
                <p className='text-blue-500 text-center font-bold text-3xl'>Daftar Kamar dan Tipe Kamar</p>
                <div className='flex w-full justify-between'>
                    <div className='p-1 flex space-x-5 bg-white rounded-full'>
                        <button onClick={() => gantiTable()} className={`p-2 ${tabel === 'kamar' ? 'bg-blue-500 text-white' : ''} font-semibold rounded-full`}>Kamar</button>
                        <button onClick={() => gantiTable()} className={`p-2 ${tabel === 'tipe_kamar' ? 'bg-blue-500 text-white' : ''} font-semibold rounded-full`}>Tipe Kamar</button>
                    </div>
                    <button onClick={() => {
                        handleAdd()
                        setOpen((prevstate) => !prevstate)
                    }}
                        className={`${session?.data.role == 'ADMIN'? '' :'hidden'} flex space-x-2 items-center bg-orange-500 hover:bg-orange-700 rounded-xl p-2 active:scale-75 transition-all`}>
                        <FaPlus className='fill-white' />
                        <p className='font-semibold text-white'>Tambah</p>
                    </button>
                </div>
                <table className='rounded-lg overflow-hidden w-m'>
                    <thead className=''>
                        {tabel === 'kamar' ?
                            <tr className=' bg-slate-300'>
                                <td className=' text-xl font-bold p-2'>Id Kamar</td>
                                <td className=' text-xl font-bold p-2'>Nomor</td>
                                <td className=' text-xl font-bold p-2'>tipe kamar</td>
                                <td className={` ${session?.data.role == 'ADMIN'? '' :'hidden'} text-xl font-bold p-2`}>Action</td>
                            </tr>
                            :
                            <tr className=' bg-slate-300'>
                                <td className=' text-xl font-bold p-2'>Id Tipe Kamar</td>
                                <td className=' text-xl font-bold p-2'>Nama</td>
                                <td className=' text-xl font-bold p-2'>Deskripsi</td>
                                <td className=' text-xl font-bold p-2'>Foto</td>
                                <td className=' text-xl font-bold p-2'>Harga</td>
                                <td className={` ${session?.data.role == 'ADMIN'? '' :'hidden'} text-xl font-bold p-2`}>Action</td>
                            </tr>
                        }
                    </thead>

                    {tabel === 'kamar' ?
                        <tbody className=''>
                            {kamar?.map((item) => (
                                <tr className=' border-b-2 '>
                                    <td className=' p-2'>{item.id_kamar}</td>
                                    <td className=' p-2'>
                                        <p>{item.nomor_kamar}</p>
                                    </td>
                                    <td className=' p-2'>
                                        <p className={`${warnaTipeKamar(item.id_tipe_kamar)} p-2 text-white rounded-xl text-center`}>{namaTipeKamar(item.id_tipe_kamar)}</p>
                                    </td>
                                    <td className={`${session?.data.role=='ADMIN'? '' :'hidden'} flex space-x-5 p-2`}>
                                        <button onClick={() => {
                                            handleEdit(item)
                                            setOpen((prevstate) => !prevstate)
                                        }} className='p-2 bg-green-500 flex space-x-2 items-center hover:bg-green-700 rounded-xl active:scale-75 transition-all'>
                                            <FaPenAlt className='fill-white' />
                                            <p className='font-semibold text-white'>Edit</p>
                                        </button>
                                        <button onClick={async () => {
                                            if (confirm('yakin ingin menghapus data ini')) {
                                                const data = await deleteKamar(String(item.id_kamar))
                                                if(data.error){
                                                    toast.error(data.error)
                                                } else {
                                                    toast.success(data.message)
                                                }
                                            }
                                        }}
                                            className='p-2 bg-red-500 flex space-x-2 items-center hover:bg-red-700  rounded-xl active:scale-75 transition-all'>
                                            <FaTrash className='fill-white' />
                                            <p className='font-semibold text-white'>Delete</p>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        :
                        <tbody className=''>
                            {tipekamar?.map((item) => (
                                <tr className=' border-b-2 '>
                                    <td className=' p-2'>{item.id_tipe_kamar}</td>
                                    <td className=' p-2'>
                                        <p>{item.nama_tipe_kamar}</p>
                                    </td>
                                    <td className=' p-2'>
                                        <p>{item.deskripsi}</p>
                                    </td>
                                    <td className=' p-2'>
                                        <Image src={`/upload/tipe_kamar/${item.foto}`} alt='foto tipe kamar' width={1000} height={20} className='rounded-xl' />
                                    </td>
                                    <td className=' p-2'>
                                        <p>{item.harga}</p>
                                    </td>
                                    <td className={`${session?.data.role=='ADMIN'? '' :'hidden'} flex space-x-5 p-2`}>
                                        <button onClick={() => {
                                            handleEdit(item)
                                            setOpen((prevstate) => !prevstate)
                                        }} className='p-2 bg-green-500 flex space-x-2 items-center hover:bg-green-700 rounded-xl active:scale-75 transition-all'>
                                            <FaPenAlt className='fill-white' />
                                            <p className='font-semibold text-white'>Edit</p>
                                        </button>
                                        <button onClick={async () => {
                                            if (confirm('yakin ingin menghapus data ini')) {
                                                const data= await deleteTipeKamar(String(item.id_tipe_kamar))
                                                if(data.error){
                                                    toast.error(data.error)
                                                } else {
                                                    toast.success(data.message)
                                                }
                                            }
                                        }}
                                            className='p-2 bg-red-500 flex space-x-2 items-center hover:bg-red-700  rounded-xl active:scale-75 transition-all'>
                                            <FaTrash className='fill-white' />
                                            <p className='font-semibold text-white'>Delete</p>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    }
                </table>
            </div>

            <div className={`${open ? '' : 'hidden'} fixed z-[99] top-0 w-screen h-screen bg-black bg-opacity-40 flex items-center justify-center`}>
                <div className=' flex flex-col space-y-5  p-5 rounded-xl bg-slate-200 '>
                    <div className='flex justify-end w-full'>
                        <button className='active:scale-75 transition-all' onClick={() => setOpen((prevstate) => !prevstate)}> <MdCancel className='fill-red-500 size-10' /></button>
                    </div>
                    <p className='text-center font-bold text-blue-500 text-3xl'>{tabel == 'kamar' ? (submit === 'add' ? "Tambah Kamar" : "Edit Kamar") : (submit === 'add' ? "Tambah Tipe Kamar" : "Edit Tipe Kamar")}</p>
                    <form onSubmit={handleSubmit} className="flex  ">
                        {tabel === 'kamar' ?
                            <div className=" flex flex-col space-y-5">
                                <p className='hidden'>id</p>
                                <p className="p-1">nomor kamar:</p>
                                <p className="p-1">tipe kamar:</p>
                            </div>
                            :
                            <div className=" flex flex-col space-y-5">
                                <p className='hidden'>id Tipe Kamar</p>
                                <p className="p-1">Nama:</p>
                                <p className="p-1">Deskripsi:</p>
                                <p className="p-1">Foto:</p>
                                <p className="p-1">Harga:</p>
                            </div>}
                        {tabel === 'kamar' ?
                            <div className="flex flex-col space-y-5">
                                <input
                                    type='number'
                                    name='id_kamar'
                                    value={id_kamar}
                                    readOnly
                                    className='hidden' />
                                <input
                                    type="number"
                                    name="nomor_kamar"
                                    className="focus:outline-blue-500  rounded-lg py-1 pl-3"
                                    value={nomor_kamar}
                                    onChange={(e) => setNomorKamar(e.target.value)}
                                    required
                                />
                                <select
                                    name="id_tipe_kamar"
                                    className="focus:outline-blue-500  rounded-lg py-1 pl-3"
                                    value={id_tipe_kamar}
                                    onChange={(e) => setId_tipe_kamar(e.target.value)}
                                    required
                                >
                                    <option value="">~~PILIH TIPE KAMAR~~</option>
                                    {tipekamar?.map((item) => (
                                        <option value={item.id_tipe_kamar}>{item.nama_tipe_kamar}</option>
                                    ))}
                                </select>
                                <button type="submit" onClick={() => {
                                    setOpen((prevstate) => !prevstate)
                                }}
                                    className="bg-blue-500 p-2 rounded-xl text-white font-bold active:scale-75 transition-all">{submit === 'add' ? "Tambah" : "Edit"}</button>
                            </div>
                            :
                            <div className="flex flex-col space-y-5">
                                <input
                                    type='number'
                                    name='id_kamar'
                                    value={id_tipe_kamar}
                                    readOnly
                                    className='hidden' />
                                <input
                                    type="text"
                                    name="nama_tipe_kamar"
                                    className="focus:outline-blue-500  rounded-lg py-1 pl-3"
                                    value={nama_tipe_kamar}
                                    onChange={(e) => setNama_tipe_kamar(e.target.value)}
                                    required
                                />
                                <input
                                    type="text"
                                    name="deskripsi"
                                    className="focus:outline-blue-500  rounded-lg py-1 pl-3"
                                    value={deskripsi}
                                    onChange={(e) => setDeskripsi(e.target.value)}
                                    required
                                />
                                <input
                                    type="file"
                                    name="foto"
                                    className="focus:outline-blue-500  rounded-lg py-1 pl-3"
                                    onChange={(e) => setFoto(e.target.files?.[0])}
                                    required
                                />
                                <input
                                    type="number"
                                    name="harga"
                                    className="focus:outline-blue-500  rounded-lg py-1 pl-3"
                                    value={harga}
                                    onChange={(e) => setHarga(e.target.value)}
                                    required
                                />
                                <button type="submit" onClick={() => {
                                    setOpen((prevstate) => !prevstate)
                                }}
                                    className="bg-blue-500 p-2 rounded-xl text-white font-bold active:scale-75 transition-all">{submit === 'add' ? "Tambah" : "Edit"}</button>
                            </div>
                        }
                    </form>
                </div>
            </div>
        </div>
    )
}
