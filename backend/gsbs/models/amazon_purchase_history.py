from django.db import models


class AmazonPurchaseHistory(models.Model):
    class Meta:
        db_table = 'amazon_purchase_history'

        constraints = [
            models.UniqueConstraint(
                fields=['order_number', 'order_column_no'],
                name='order_number_unique',
            ),
        ]

    order_number = models.CharField(max_length=32, blank=False, null=False)
    order_column_no = models.IntegerField(blank=False, null=False)
    order_date = models.DateField(blank=False, null=False)
    item_name = models.CharField(max_length=512, blank=False, null=False)
    store_name = models.CharField(max_length=128, blank=False, null=False)
    price = models.IntegerField(blank=False, null=False)

    def __str__(self):
        return self.item_name
