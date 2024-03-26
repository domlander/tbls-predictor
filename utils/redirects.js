// Redirect internally
const redirectInternal = (destination) => ({
  redirect: {
    destination: destination || "/",
    permanent: false,
  },
});

export default redirectInternal;
