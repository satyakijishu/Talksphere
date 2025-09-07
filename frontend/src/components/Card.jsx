import React from 'react'

function Card({ image }) {
  return (
    <div className="w-full aspect-[3/4] bg-[#020220] border-2 border-[#0000ff66] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white">
      <img
        src={image}
        alt="Card Image"
        className="w-full h-full object-cover rounded-2xl"
      />
    </div>
  )
}

export default Card
