export default async function handler(req, res) {
  const userId = req.query.id;

  if (!userId) {
    return res.status(400).json({ error: "Missing id" });
  }

  try {
    const url = `https://inventory.roproxy.com/v1/users/${userId}/assets/34`;
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(500).json({ error: "Failed to fetch passes" });
    }

    const data = await response.json();
    const passes = [];

    if (!data || !data.data) {
      return res.json({ data: [] });
    }

    data.data.forEach(item => {
      if (item.creator && item.creator.id === Number(userId)) {
        if (item.product && item.product.isForSale === true) {
          passes.push({
            id: item.id,
            name: item.name,
            price: item.product.price
          });
        }
      }
    });

    return res.status(200).json({ data: passes });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
