await queryInterface.addColumn("Students", "paymentMode", {
  type: Sequelize.STRING,
  allowNull: true,
});

await queryInterface.addColumn("Students", "paymentRef", {
  type: Sequelize.STRING,
  allowNull: true,
});
