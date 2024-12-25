import {
   DataTypes,
   Model,
   InferAttributes,
   InferCreationAttributes,
   CreationOptional,
} from "sequelize";
import { sequelize } from "../lib/db";

class VehicleData extends Model<
   InferAttributes<VehicleData>,
   InferCreationAttributes<VehicleData>
> {
   declare Make: string;
   declare Model: string;
   declare Annual_Petroleum_Consumption_For_Fuel_Type1: number;
   declare Annual_Petroleum_Consumption_For_Fuel_Type2: number;
   declare Time_to_charge_at_120V: number;
   declare Time_to_charge_at_240V: number;
   declare City_Mpg_For_Fuel_Type1: number;
   declare Unrounded_City_Mpg_For_Fuel_Type1_2: number;
   declare City_Mpg_For_Fuel_Type2: number;
   declare Unrounded_City_Mpg_For_Fuel_Type2: number;
   declare City_gasoline_consumption: number;
   declare City_electricity_consumption: number;
   declare EPA_city_utility_factor: number;
   declare Co2_Fuel_Type1: number;
   declare Co2_Fuel_Type2: number;
   declare Co2_Tailpipe_For_Fuel_Type2: number;
   declare Co2_Tailpipe_For_Fuel_Type1: number;
   declare Combined_Mpg_For_Fuel_Type1: number;
   declare Unrounded_Combined_Mpg_For_Fuel_Type1: number;
   declare Combined_Mpg_For_Fuel_Type2: number;
   declare Unrounded_Combined_Mpg_For_Fuel_Type2: number;
   declare Combined_electricity_consumption: number;
   declare Combined_gasoline_consumption: number;
   declare EPA_combined_utility_factor: number;
   declare Cylinders: number;
   declare Engine_displacement: number;
   declare Drive: string;
   declare EPA_model_type_index: number;
   declare Engine_descriptor: string;
   declare EPA_Fuel_Economy_Score: number;
   declare Annual_Fuel_Cost_For_Fuel_Type1: number;
   declare Annual_Fuel_Cost_For_Fuel_Type2: number;
   declare Fuel_Type: string;
   declare Fuel_Type1: string;
   declare GHG_Score: number;
   declare GHG_Score_Alternative_Fuel: number;
   declare Highway_Mpg_For_Fuel_Type1: number;
   declare Unrounded_Highway_Mpg_For_Fuel_Type1: number;
   declare Highway_Mpg_For_Fuel_Type2: number;
   declare Unrounded_Highway_Mpg_For_Fuel_Type2: number;
   declare Highway_gasoline_consumption: number;
   declare Highway_electricity_consumption: number;
   declare EPA_highway_utility_factor: number;
   declare Hatchback_luggage_volume: number;
   declare Hatchback_passenger_volume: number;
   declare ID: CreationOptional<number>;
   declare Door_2_luggage_volume: number;
   declare Door_4_luggage_volume: number;
   declare MPG_Data: string;
   declare PHEV_Blended: boolean;
   declare Door_2_passenger_volume: number;
   declare Door_4_passenger_volume: number;
   declare Range_For_Fuel_Type1: number;
   declare Range_City_For_Fuel_Type1: number;
   declare Range_City_For_Fuel_Type2: number;
   declare Range_Highway_For_Fuel_Type1: number;
   declare Range_Highway_For_Fuel_Type2: number;
   declare Transmission: string;
   declare Unadjusted_City_Mpg_For_Fuel_Type1: number;
   declare Unadjusted_City_Mpg_For_Fuel_Type2: number;
   declare Unadjusted_Highway_Mpg_For_Fuel_Type1: number;
   declare Unadjusted_Highway_Mpg_For_Fuel_Type2: number;
   declare Vehicle_Size_Class: string;
   declare Year: number;
   declare You_Save_Spend: number;
   declare Guzzler: string;
   declare Transmission_descriptor: string;
   declare T_Charger: string;
   declare S_Charger: string;
   declare ATV_Type: string;
   declare Fuel_Type2: string;
   declare Epa_Range_For_Fuel_Type2: number;
   declare Electric_motor: string;
   declare MFR_Code: string;
   declare c240Dscr: string;
   declare charge240b: string;
   declare C240B_Dscr: string;
   declare Created_On: Date;
   declare Modified_On: Date;
   declare Start_Stop: boolean;
   declare PHEV_City: number;
   declare PHEV_Highway: number;
   declare PHEV_Combined: number;
   declare Base_Model: string;
}

VehicleData.init(
   {
      Make: {
         type: DataTypes.STRING(255),
         allowNull: false,
      },
      Model: {
         type: DataTypes.STRING(255),
         allowNull: false,
      },
      Annual_Petroleum_Consumption_For_Fuel_Type1: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      Annual_Petroleum_Consumption_For_Fuel_Type2: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      Time_to_charge_at_120V: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      Time_to_charge_at_240V: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      City_Mpg_For_Fuel_Type1: {
         type: DataTypes.INTEGER,
         allowNull: true,
      },
      Unrounded_City_Mpg_For_Fuel_Type1_2: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      City_Mpg_For_Fuel_Type2: {
         type: DataTypes.INTEGER,
         allowNull: true,
      },
      Unrounded_City_Mpg_For_Fuel_Type2: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      City_gasoline_consumption: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      City_electricity_consumption: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      EPA_city_utility_factor: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      Co2_Fuel_Type1: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      Co2_Fuel_Type2: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      Co2_Tailpipe_For_Fuel_Type2: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      Co2_Tailpipe_For_Fuel_Type1: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      Combined_Mpg_For_Fuel_Type1: {
         type: DataTypes.INTEGER,
         allowNull: true,
      },
      Unrounded_Combined_Mpg_For_Fuel_Type1: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      Combined_Mpg_For_Fuel_Type2: {
         type: DataTypes.INTEGER,
         allowNull: true,
      },
      Unrounded_Combined_Mpg_For_Fuel_Type2: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      Combined_electricity_consumption: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      Combined_gasoline_consumption: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      EPA_combined_utility_factor: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      Cylinders: {
         type: DataTypes.INTEGER,
         allowNull: true,
      },
      Engine_displacement: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      Drive: {
         type: DataTypes.STRING(255),
         allowNull: true,
      },
      EPA_model_type_index: {
         type: DataTypes.INTEGER,
         allowNull: true,
      },
      Engine_descriptor: {
         type: DataTypes.STRING(255),
         allowNull: true,
      },
      EPA_Fuel_Economy_Score: {
         type: DataTypes.INTEGER,
         allowNull: true,
      },
      Annual_Fuel_Cost_For_Fuel_Type1: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      Annual_Fuel_Cost_For_Fuel_Type2: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      Fuel_Type: {
         type: DataTypes.STRING(255),
         allowNull: true,
      },
      Fuel_Type1: {
         type: DataTypes.STRING(255),
         allowNull: true,
      },
      GHG_Score: {
         type: DataTypes.INTEGER,
         allowNull: true,
      },
      GHG_Score_Alternative_Fuel: {
         type: DataTypes.INTEGER,
         allowNull: true,
      },
      Highway_Mpg_For_Fuel_Type1: {
         type: DataTypes.INTEGER,
         allowNull: true,
      },
      Unrounded_Highway_Mpg_For_Fuel_Type1: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      Highway_Mpg_For_Fuel_Type2: {
         type: DataTypes.INTEGER,
         allowNull: true,
      },
      Unrounded_Highway_Mpg_For_Fuel_Type2: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      Highway_gasoline_consumption: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      Highway_electricity_consumption: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      EPA_highway_utility_factor: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      Hatchback_luggage_volume: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      Hatchback_passenger_volume: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      ID: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      Door_2_luggage_volume: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      Door_4_luggage_volume: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      MPG_Data: {
         type: DataTypes.CHAR(1),
         allowNull: true,
      },
      PHEV_Blended: {
         type: DataTypes.BOOLEAN,
         allowNull: true,
      },
      Door_2_passenger_volume: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      Door_4_passenger_volume: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      Range_For_Fuel_Type1: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      Range_City_For_Fuel_Type1: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      Range_City_For_Fuel_Type2: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      Range_Highway_For_Fuel_Type1: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      Range_Highway_For_Fuel_Type2: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      Transmission: {
         type: DataTypes.STRING(255),
         allowNull: true,
      },
      Unadjusted_City_Mpg_For_Fuel_Type1: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      Unadjusted_City_Mpg_For_Fuel_Type2: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      Unadjusted_Highway_Mpg_For_Fuel_Type1: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      Unadjusted_Highway_Mpg_For_Fuel_Type2: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      Vehicle_Size_Class: {
         type: DataTypes.STRING(255),
         allowNull: true,
      },
      Year: {
         type: DataTypes.INTEGER,
         allowNull: true,
      },
      You_Save_Spend: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      Guzzler: {
         type: DataTypes.CHAR(1),
         allowNull: true,
      },
      Transmission_descriptor: {
         type: DataTypes.STRING(255),
         allowNull: true,
      },
      T_Charger: {
         type: DataTypes.CHAR(1),
         allowNull: true,
      },
      S_Charger: {
         type: DataTypes.CHAR(1),
         allowNull: true,
      },
      ATV_Type: {
         type: DataTypes.STRING(255),
         allowNull: true,
      },
      Fuel_Type2: {
         type: DataTypes.STRING(255),
         allowNull: true,
      },
      Epa_Range_For_Fuel_Type2: {
         type: DataTypes.FLOAT,
         allowNull: true,
      },
      Electric_motor: {
         type: DataTypes.STRING(255),
         allowNull: true,
      },
      MFR_Code: {
         type: DataTypes.STRING(255),
         allowNull: true,
      },
      c240Dscr: {
         type: DataTypes.STRING(255),
         allowNull: true,
      },
      charge240b: {
         type: DataTypes.STRING(255),
         allowNull: true,
      },
      C240B_Dscr: {
         type: DataTypes.STRING(255),
         allowNull: true,
      },
      Created_On: {
         type: DataTypes.DATE,
         allowNull: true,
      },
      Modified_On: {
         type: DataTypes.DATE,
         allowNull: true,
      },
      Start_Stop: {
         type: DataTypes.BOOLEAN,
         allowNull: true,
      },
      PHEV_City: {
         type: DataTypes.INTEGER,
         allowNull: true,
      },
      PHEV_Highway: {
         type: DataTypes.INTEGER,
         allowNull: true,
      },
      PHEV_Combined: {
         type: DataTypes.INTEGER,
         allowNull: true,
      },
      Base_Model: {
         type: DataTypes.STRING(255),
         allowNull: true,
      },
   },
   {
      sequelize,
      modelName: "VehicleData",
      tableName: "VehicleData",
      timestamps: false,
   }
);

export default VehicleData;
