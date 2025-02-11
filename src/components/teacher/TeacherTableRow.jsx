import React from "react";
import { Chip, Typography, IconButton, Tooltip } from "@material-tailwind/react";
import { PencilIcon } from "@heroicons/react/24/solid";

const TeacherRow = ({ teacher, onEdit }) => {
  const { _id, name, email, mobileNo, aboutUs, area, subject, chargeRate, image, createdAt } = teacher;

  return (
    <tr key={_id} className="hover:bg-gray-50">
      <td className="p-3 border-b">
        <Typography variant="small" className="font-medium text-gray-800">
          {name}
        </Typography>
      </td>
      <td className="p-3 border-b">
        <Typography variant="small" className="text-gray-600">
          {email}
        </Typography>
      </td>
      <td className="p-3 border-b">
        <Typography variant="small" className="text-gray-600">
          {mobileNo}
        </Typography>
      </td>
      <td className="p-3 border-b">
        <Typography variant="small" className="text-gray-600">
          {aboutUs}
        </Typography>
      </td>
      <td className="p-3 border-b">
        <Typography variant="small" className="text-gray-600">
          {area?.name || "-"}
        </Typography>
      </td>
      <td className="p-3 border-b">
        <Typography variant="small" className="text-gray-600">
          {subject}
        </Typography>
      </td>
      <td className="p-3 border-b">
        <Typography variant="small" className="text-gray-800">
          ₹{chargeRate}/hr
        </Typography>
      </td>
      <td className="p-3 border-b">
        {image ? (
          <img src={image} alt="Teacher Image" className="h-12 w-12 rounded-full object-cover" />
        ) : (
          <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
        )}
      </td>
      <td className="p-3 border-b">
        <Tooltip content="Edit Teacher">
          <IconButton variant="text" onClick={() => onEdit(teacher)}>
            <PencilIcon className="h-4 w-4 text-gray-600" />
          </IconButton>
        </Tooltip>
      </td>
    </tr>
  );
};

export default TeacherRow;
