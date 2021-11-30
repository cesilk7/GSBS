from django.db import models


class RakutenCardPaymentHistory(models.Model):
    class Meta:
        db_table = 'rakuten_card_payment_history'

        constraints = [
            models.UniqueConstraint(
                fields=['payment_date', 'payment_row'],
                name='payment_unique',
            ),
        ]

    payment_date = models.DateField(blank=False, null=False)
    payment_row = models.IntegerField(blank=False, null=False)
    store_name = models.CharField(max_length=64, blank=False, null=False)
    user = models.CharField(max_length=64, blank=False, null=False)
    payment_method = models.CharField(max_length=64, blank=False, null=False)
    payment = models.IntegerField(blank=False, null=False)

    def __str__(self):
        return self.store_name
