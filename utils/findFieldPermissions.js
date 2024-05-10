const findFieldPermissions = (field, tableConfig) => {
  let perm = null;

  if (tableConfig?.user_role?.fields && tableConfig.user_role.fields[field]) {
    perm = tableConfig.user_role.fields[field];
  } else if (tableConfig?.user_role?.additional_fields) {
    perm = tableConfig.user_role.additional_fields;
  } else {
    perm = { read: false, write: false };

    if (tableConfig?.user_role?.read) perm.read = tableConfig?.user_role?.read;
    if (tableConfig?.user_role?.write)
      perm.write = tableConfig?.user_role?.write;
  }

  return perm;
};

export default findFieldPermissions;
