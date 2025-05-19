import Plan from "../models/plan.model.js";

export const createPlan = async (req, res) => {
    try {
      const { name, price, interval, stripePriceId, features } = req.body;
      
      const newPlan = new Plan({
        name,
        price,
        interval,
        stripePriceId,
        features
      });
  
      const savedPlan = await newPlan.save();
      res.status(201).json(savedPlan);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

  export const getPlans = async (req, res) => {
    try {
      const plans = await Plan.find();
      res.status(200).json(plans);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };