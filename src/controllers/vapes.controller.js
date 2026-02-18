import { supabase } from "../supabaseClient.js";
import path from "path";

const VAPE_LIST_COLUMNS = [
  "id",
  "name",
  "price",
  "brand",
  "flavor",
  "strength",
  "stock",
  "puffs",
  "image",
].join(",");

const VAPE_DETAIL_COLUMNS = [
  "id",
  "name",
  "price",
  "description",
  "brand",
  "flavor",
  "strength",
  "stock",
  "puffs",
  "image",
].join(",");

export const getVapes = async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from("vapes")
      .select(VAPE_LIST_COLUMNS)
      .order("id", { ascending: false });

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(200).json(data ?? []);
  } catch (error) {
    console.error("GET VAPES CRASH:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getVapeById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const { data, error } = await supabase
      .from("vapes")
      .select(VAPE_DETAIL_COLUMNS)
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ message: "Vape not found" });
      }

      return res.status(500).json({ message: error.message });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("GET VAPE BY ID CRASH:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createVape = async (req, res) => {
  try {
    const { name, price, description, brand, flavor, strength, stock, puffs } =
      req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ message: "Название и цена обязательна" });
    }

    let image = null;

    if (req.file) {
      const ext = path.extname(req.file.originalname) || ".jpg";
      const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("vapes")
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false,
        });

      if (uploadError) {
        return res.status(500).json({ message: uploadError.message });
      }
      image = `${process.env.SUPABASE_URL}/storage/v1/object/public/vapes/${fileName}`;
    }

    const payload = {
      name: String(name).trim(),
      price: Number(price),
      description: description || "",
      brand: brand || "",
      flavor: flavor || "",
      strength: strength || "",
      stock: Number(stock) || 0,
      puffs: Number(puffs) || 0,
      image,
    };

    const { data, error } = await supabase
      .from("vapes")
      .insert([payload])
      .select(VAPE_DETAIL_COLUMNS)
      .single();

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(201).json(data);
  } catch (error) {
    console.error("CREATE VAPE CRASH:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateVape = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { error } = await supabase.from("vapes").update(updates).eq("id", id);

    if (error) {
      return res.status(500).json({ message: error.message });
    }
    return res.json({ ok: true });
  } catch (error) {
    console.error("UPDATE VAPE CRASH:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const deleteVape = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("vapes").delete().eq("id", id);

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("DELETE VAPE CRASH:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
