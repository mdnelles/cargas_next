import {
   DataTypes,
   Model,
   InferAttributes,
   InferCreationAttributes,
   CreationOptional,
} from "sequelize";
import { sequelize } from "../lib/db";

class FuelUp extends Model<
   InferAttributes<FuelUp>,
   InferCreationAttributes<FuelUp>
> {
   declare id: CreationOptional<number>;
   declare odometer: number;
   declare previousOdometer: number | null;
   declare price: number;
   declare volume: number;
   declare totalCost: number;
   declare isPartialFuelUp: boolean;
   declare isMissedFuelUp: boolean;
   declare vehicleId: number;
   declare dateTime: Date;
   declare paymentType: string | null;
   declare kilometersAdded: number | null;
}

FuelUp.init(
   {
      id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      odometer: {
         type: DataTypes.FLOAT,
         allowNull: false,
         validate: {
            min: 0,
         },
      },
      previousOdometer: {
         type: DataTypes.FLOAT,
         allowNull: true,
         validate: {
            min: 0,
         },
      },
      price: {
         type: DataTypes.DECIMAL(10, 2),
         allowNull: false,
         validate: {
            min: 0,
         },
      },
      volume: {
         type: DataTypes.FLOAT,
         allowNull: false,
         validate: {
            min: 0,
         },
      },
      totalCost: {
         type: DataTypes.DECIMAL(10, 2),
         allowNull: false,
         validate: {
            min: 0,
         },
      },
      isPartialFuelUp: {
         type: DataTypes.BOOLEAN,
         allowNull: false,
         defaultValue: false,
      },
      isMissedFuelUp: {
         type: DataTypes.BOOLEAN,
         allowNull: false,
         defaultValue: false,
      },
      vehicleId: {
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      dateTime: {
         type: DataTypes.DATE,
         allowNull: false,
      },
      paymentType: {
         type: DataTypes.STRING,
         allowNull: true,
      },
      kilometersAdded: {
         type: DataTypes.FLOAT,
         allowNull: true,
         validate: {
            min: 0,
         },
      },
   },
   {
      sequelize,
      modelName: "FuelUp",
      tableName: "fuel_up_records",
      timestamps: true,
   }
);

export default FuelUp;
